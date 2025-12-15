import { tool } from 'ai';
import { z } from 'zod';
import { chromium, type Browser, type Page } from 'playwright';

// Selectors for non-content elements to remove before extraction
const SELECTORS_TO_REMOVE = [
  'footer',
  'nav',
  'aside',
  '[role="navigation"]',
  '[role="banner"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  // Headers and footers by class/id
  '[class*="header"]',
  '[id*="header"]',
  '[class*="footer"]',
  '[id*="footer"]',
  // Cookie/consent banners
  '[class*="cookie"]',
  '[id*="cookie"]',
  '[class*="consent"]',
  '[id*="consent"]',
  // Social media widgets
  '[class*="social"]',
  '[class*="share"]',
  // Comments sections
  '[class*="comment"]',
  '[id*="comment"]',
  '#disqus_thread',
  // Sidebars
  '[class*="sidebar"]',
  '[id*="sidebar"]',
  // Navigation and menus
  '[class*="menu"]',
  '[class*="navigation"]',
  '[id*="menu"]',
  // Ads and promotional content
  '[class*="ad-"]',
  '[class*="advertisement"]',
  '[id*="ad-"]',
  '[class*="promo"]',
  // Related/recommended content
  '[class*="related"]',
  '[class*="recommended"]',
  // Newsletter signups
  '[class*="newsletter"]',
  '[class*="subscribe"]',
  // Popups and modals
  '[class*="modal"]',
  '[class*="popup"]',
  '[class*="overlay"]',
];

// Helper to wrap async operations with a timeout
async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallbackMessage: string
): Promise<T | string> {
  let timeoutId: Timer;
  const timeoutPromise = new Promise<string>(resolve => {
    timeoutId = setTimeout(() => resolve(fallbackMessage), ms);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    // Return fallback message on ANY error - never throw
    clearTimeout(timeoutId!);
    console.error('readUrl error:', error);
    return fallbackMessage;
  }
}

async function fetchUrlContent(url: string): Promise<string> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Launch headless browser
    browser = await chromium.launch({
      headless: true,
    });

    // Create page with realistic user agent
    page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    // Navigate to the page
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // Wait for dynamic content to load
    await page.waitForTimeout(2000);

    // Extract title
    const pageTitle = await page.title();

    // Get meta description if available
    let description = '';
    try {
      const metaDesc = await page.$('meta[name="description"]');
      if (metaDesc) {
        description = (await metaDesc.getAttribute('content')) || '';
      }
    } catch {
      // No description meta tag
    }

    // Remove non-content elements before extracting text
    await page.evaluate((selectors: string[]) => {
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        } catch {
          // Selector might not be valid, skip it
        }
      });
    }, SELECTORS_TO_REMOVE);

    // Get cleaned body text
    const mainText = (await page.innerText('body'))
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ') // Multiple spaces to single space
      .replace(/^\s+|\s+$/gm, '') // Trim each line
      .trim();

    if (!mainText || mainText.length === 0) {
      return 'No readable content found on this page.';
    }

    // Truncate if too long
    const maxLength = 12000;
    const truncated = mainText.length > maxLength;
    const content = truncated ? mainText.slice(0, maxLength) + '...' : mainText;

    // Build output
    let output = `## ${pageTitle || 'Untitled Page'}\n`;
    output += `**URL:** ${url}\n`;
    if (description) {
      output += `**Description:** ${description}\n`;
    }
    output += `\n---\n\n${content}`;
    if (truncated) {
      output += `\n\n*[Content truncated from ${mainText.length} to ${maxLength} characters]*`;
    }

    return output;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : '';
    const lowerMsg = errorMsg.toLowerCase();

    // Provide helpful error messages - always return a string, never throw
    if (
      errorName === 'TimeoutError' ||
      lowerMsg.includes('timeout') ||
      lowerMsg.includes('timed out')
    ) {
      return `Timeout: Page "${url}" took too long to load. Skipping and continuing research.`;
    }
    if (lowerMsg.includes('err_name_not_resolved')) {
      return `Could not resolve domain for "${url}". Skipping and continuing research.`;
    }
    if (lowerMsg.includes('err_connection_refused')) {
      return `Connection refused for "${url}". Skipping and continuing research.`;
    }
    if (lowerMsg.includes('err_connection_reset')) {
      return `Connection reset for "${url}". Skipping and continuing research.`;
    }

    return `Could not read "${url}": ${errorMsg}. Continuing research.`;
  } finally {
    // Clean up browser resources
    if (page) {
      await page.close().catch(() => {});
    }
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

export const readUrl = tool({
  description:
    'Fetch and read the full content of a webpage URL using a real browser. Bypasses bot detection and handles JavaScript-rendered content. Use this to get detailed information from a specific page found in search results.',
  inputSchema: z.object({
    url: z.string().url().describe('The URL to fetch and read'),
  }),
  execute: async ({ url }) => {
    // Wrap the entire operation with a 45-second timeout
    // This ensures we never hang indefinitely
    const result = await withTimeout(
      fetchUrlContent(url),
      45000,
      `Timeout: Page "${url}" took too long. Skipping and continuing research.`
    );
    return result;
  },
});
