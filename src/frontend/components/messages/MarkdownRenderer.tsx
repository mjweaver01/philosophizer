import React from 'react';
import Markdown from 'marked-react';

// Custom renderer components for better spacing and styling
const renderer = {
  paragraph(children: React.ReactNode) {
    return <p className="my-4 leading-7">{children}</p>;
  },
  heading(children: React.ReactNode, level: number) {
    const levelStyles = {
      1: 'text-3xl mt-8 mb-4',
      2: 'text-2xl mt-8 mb-4',
      3: 'text-xl mt-6 mb-3',
      4: 'text-lg mt-6 mb-3',
      5: 'text-base mt-4 mb-2',
      6: 'text-sm mt-4 mb-2',
    };

    const className = `font-semibold tracking-tight ${levelStyles[level as keyof typeof levelStyles]}`;

    switch (level) {
      case 1:
        return <h1 className={className}>{children}</h1>;
      case 2:
        return <h2 className={className}>{children}</h2>;
      case 3:
        return <h3 className={className}>{children}</h3>;
      case 4:
        return <h4 className={className}>{children}</h4>;
      case 5:
        return <h5 className={className}>{children}</h5>;
      case 6:
        return <h6 className={className}>{children}</h6>;
      default:
        return <h1 className={className}>{children}</h1>;
    }
  },
  list(children: React.ReactNode, ordered: boolean) {
    return ordered ? (
      <ol className="my-4 space-y-2 list-decimal list-inside">{children}</ol>
    ) : (
      <ul className="my-4 space-y-2 list-disc list-inside">{children}</ul>
    );
  },
  listItem(children: React.ReactNode) {
    return <li className="my-1">{children}</li>;
  },
  blockquote(children: React.ReactNode) {
    return (
      <blockquote className="my-6 border-l-4 border-border pl-4 italic text-text-secondary">
        {children}
      </blockquote>
    );
  },
  code(code: string, lang?: string) {
    return (
      <pre className="my-4 bg-surface-secondary text-text p-4 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  },
  codespan(code: string) {
    return (
      <code className="text-text bg-surface-secondary px-1.5 py-0.5 rounded text-sm">
        {code}
      </code>
    );
  },
  link(href: string, children: React.ReactNode) {
    return (
      <a
        href={href}
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  strong(children: React.ReactNode) {
    return <strong className="font-semibold text-text">{children}</strong>;
  },
  em(children: React.ReactNode) {
    return <em className="italic">{children}</em>;
  },
  hr() {
    return <hr className="my-8 border-border" />;
  },
  table(children: React.ReactNode) {
    return <table className="my-6 w-full border-collapse">{children}</table>;
  },
  image(href: string, text: string) {
    return <img src={href} alt={text} className="rounded-lg my-6 max-w-full" />;
  },
};

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = 'text-text',
}: MarkdownRendererProps) {
  return (
    <div className={`${className} [&>*:first-child]:mt-0`}>
      <Markdown value={content} renderer={renderer} breaks gfm />
    </div>
  );
}
