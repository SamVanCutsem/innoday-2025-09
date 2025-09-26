# CLAUDE.md

# Consultant CV Management System - Development Guidelines

## Project Overview
A web-based application for managing consultant profiles, projects, and generating customized CVs. The system serves as a centralized repository for consultant information and enables rapid CV generation for business proposals.

## Core Domain Entities

### Consultant
- Represents individual consultants with professional profiles
- Contains: personal info, skills, experience, certifications
- Key relationships: has many Projects, has many Skills, has many Certifications

### Project
- Represents client engagements and work experience
- Contains: description, duration, technologies, outcomes, client reference
- Key relationships: belongs to Consultant, belongs to Client, has many Technologies

### Client
- Represents organizations consultants have worked with
- Contains: company info, industry, NDA status
- Key relationships: has many Projects

### CV Template
- Represents different CV formats and layouts
- Contains: sections, formatting rules, export formats
- Key relationships: used by many CVs

### Generated CV
- Represents a specific CV instance created for an opportunity
- Contains: selected projects, customized descriptions, version history
- Key relationships: belongs to Consultant, uses Template

## Development Commands

### Essential Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run type-check` - Run TypeScript type checking

### Adding shadcn/ui Components
```bash
npx shadcn-ui@latest add [component-name]
```
Components are installed to `src/components/ui/` with automatic configuration.

## Architecture Overview

### Tech Stack
- **Next.js 15** with App Router and React Server Components
- **React 19** with latest features and concurrent rendering
- **TypeScript** with strict mode and path mapping
- **Tailwind CSS** with CSS variables for theming
- **shadcn/ui** for accessible, customizable components
- **Radix UI** primitives for complex component behavior

### Project Structure
```
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Homepage
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   └── utils.ts           # Utility functions (cn helper)
├── types/                 # TypeScript type definitions
└── utils/                 # Additional utility functions
```

### Path Mapping
Use these TypeScript path aliases:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/utils/*` → `./src/utils/*`
- `@/types/*` → `./src/types/*`

### Styling System
- **CSS Variables**: Theme colors defined in `globals.css` with automatic dark/light mode support
- **Tailwind Classes**: Use semantic color classes (`bg-background`, `text-foreground`, etc.)
- **Component Variants**: Leverage `class-variance-authority` for component styling
- **Utility Function**: Use `cn()` from `@/lib/utils` for conditional classes

### Component Patterns
- All UI components use Radix UI primitives for accessibility
- Components support `className` prop for customization
- Forwarded refs pattern for proper component composition
- Variants defined using `cva()` for consistent styling

## Custom Agents

### Frontend Developer Agent (`frontend-developer`)
- Specializes in React 19, Next.js 15, and modern frontend architecture
- Masters client-side and server-side rendering patterns
- Expertise in performance optimization, accessibility, and design systems
- Use for UI components, frontend issues, and React/Next.js development

### UI/UX Designer Agent (`ui-ux-designer`)
- Focuses on design systems, accessibility-first design, and user research
- Masters design tokens, component libraries, and inclusive design
- Expertise in user flows, interface optimization, and cross-platform design
- Use for design systems, wireframes, and interface optimization

## Configuration Files

### Key Configurations
- `next.config.js` - Next.js configuration with React 19 support and image optimization
- `tailwind.config.ts` - Tailwind with shadcn/ui theme and CSS variables
- `components.json` - shadcn/ui configuration for component installation
- `tsconfig.json` - TypeScript with strict mode and path mapping

### Development Features
- Hot reload with React Fast Refresh
- TypeScript strict mode for better error catching
- ESLint with Next.js recommended rules
- Automatic CSS purging in production builds