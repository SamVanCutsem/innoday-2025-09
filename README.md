# Innovation Day 2025-09

A modern Next.js 15 application built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Unstyled, accessible UI primitives

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # Global styles with CSS variables
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/
│   └── ui/             # shadcn/ui components
│       ├── button.tsx
│       └── card.tsx
├── lib/
│   └── utils.ts        # Utility functions
├── types/              # TypeScript type definitions
└── utils/              # Additional utilities
```

## Adding New Components

This project uses shadcn/ui for components. To add new components:

```bash
npx shadcn-ui@latest add [component-name]
```

## Features

- Server-side rendering with Next.js App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Dark mode support (CSS variables)
- ESLint and Prettier for code quality
- Responsive design
- Accessible components with Radix UI primitives

## Development

The project is set up with modern development practices:

- Strict TypeScript configuration
- ESLint with Next.js rules
- Path mapping for clean imports (`@/components`, `@/lib`, etc.)
- CSS variables for theming
- Tailwind CSS with custom design tokens
