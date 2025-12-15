# Philosophizer

Agentic chat with tools and reasoning, using the wisdom of history's greatest philosophers and theologians.

Built with Bun, React, and TypeScript.

## Technologies Used

- **Runtime**: Bun
- **AI SDK**: Vercel AI SDK v6 (beta)
- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS 4
- **Markdown**: Marked with KaTeX for math rendering
- **Validation**: Zod schemas

## Setup

### Prerequisites

- [Bun](https://bun.sh) installed

### Installation

```bash
# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: AI Provider Configuration
AI_BASE_URL=http://localhost:1234/v1
AI_API_KEY=lm-studio

# Model Configuration
LLM_MODEL=qwen3-1.7b
SEARCH_MODEL=gpt-4.1-mini
```

## Usage

### Development Mode

```bash
bun run dev
```

### Production Mode

```bash
bun run start
```

### Debug Mode

```bash
bun run dev:debug
```
