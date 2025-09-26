# CV Management System - User Flow Design Specification

## 1. User Journey Mapping

### Primary User Flow: Project Management Journey

```
Entry Point → Dashboard → Project Actions → Completion
     ↓           ↓            ↓             ↓
  Login/Auth  Overview    CRUD Operations  Success State
     ↓           ↓            ↓             ↓
  Navigation  Filter/Search  Form Handling  Confirmation
```

### Detailed User Flow States

#### A. Dashboard Entry
```
[Login] → [Dashboard Load] → [Project Overview]
    ↓
[Empty State] OR [Populated State]
    ↓              ↓
[Add First Project] → [Project Management]
```

#### B. Project Management Flow
```
[Project List View]
    ↓
[Action Selection]
    ↓
┌─[View Details]────[Edit Project]────[Delete Project]
│       ↓               ↓                    ↓
│   [Detail Modal]  [Edit Form]         [Confirm Delete]
│       ↓               ↓                    ↓
│   [Close/Edit]    [Save/Cancel]       [Delete/Cancel]
│
├─[Add New Project]
│       ↓
│   [Creation Form]
│       ↓
│   [Save/Cancel]
│
└─[Filter/Search]
        ↓
    [Updated List]
```

#### C. Search and Organization Flow
```
[Project List]
    ↓
[Search Input] → [Real-time Filter] → [Results Display]
    ↓
[Filter Options]
    ↓
┌─[By Client]
├─[By Technology]
├─[By Date Range]
├─[By Role]
└─[By Status]
    ↓
[Combined Filters] → [Sorted Results]
```

## 2. Information Architecture

### Project Data Model

```typescript
interface Project {
  // Basic Information
  id: string;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date | null;
  status: 'active' | 'completed' | 'on-hold';
  role: string;

  // Technical Details
  technologies: Technology[];
  methodologies: Methodology[];
  teamSize: number;

  // Project Context
  description: string;
  objectives: string[];
  challenges: string[];
  achievements: string[];

  // Outcomes & Impact
  businessValue: string;
  technicalImpact: string;
  metrics: ProjectMetric[];

  // Reference Information
  clientContact: ClientContact | null;
  projectManager: string;

  // Artifacts & Documentation
  artifacts: ProjectArtifact[];
  portfolio: boolean; // Featured in portfolio

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface Technology {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'tool';
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
}

interface ProjectMetric {
  name: string;
  value: string;
  type: 'performance' | 'business' | 'technical';
}

interface ProjectArtifact {
  type: 'document' | 'link' | 'image';
  title: string;
  url: string;
  description?: string;
}
```

### Information Hierarchy

```
CV Management System
├── Dashboard
│   ├── Quick Stats
│   ├── Recent Projects
│   └── Action Shortcuts
├── Projects
│   ├── List View
│   │   ├── Card View
│   │   └── Table View
│   ├── Detail View
│   ├── Create/Edit Forms
│   └── Search & Filters
├── Portfolio
│   ├── Featured Projects
│   └── Export Options
└── Settings
    ├── Profile
    └── Preferences
```

## 3. Interface Design Patterns

### 3.1 Project Listing & Overview

#### Card View Pattern
```
┌─────────────────────────────────────┐
│ Project Card                        │
├─────────────────────────────────────┤
│ [Client Logo] Project Title         │
│ Client Name • Role                  │
│ Jan 2024 - Present                  │
│                                     │
│ [React] [Next.js] [TypeScript]      │
│                                     │
│ ├─ View Details                     │
│ ├─ Edit Project                     │
│ └─ Delete                           │
└─────────────────────────────────────┘
```

#### Table View Pattern
```
┌─────────────────────────────────────────────────────────────┐
│ Project Title    │ Client    │ Duration    │ Technologies    │
├─────────────────────────────────────────────────────────────┤
│ E-commerce App   │ TechCorp  │ 6 months    │ React, Node     │
│ Mobile Platform  │ StartupX  │ 3 months    │ React Native    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Project Creation & Editing Forms

#### Multi-Step Form Pattern
```
Step Indicator: ● ○ ○ ○ ○
[Basic Info] → [Technical] → [Outcomes] → [References] → [Review]

Step 1: Basic Information
┌─────────────────────────────────────┐
│ Project Title *                     │
│ [                              ]    │
│                                     │
│ Client Name *                       │
│ [                              ]    │
│                                     │
│ Role/Position *                     │
│ [                              ]    │
│                                     │
│ Duration                            │
│ From: [        ] To: [        ]     │
│ □ Currently active                  │
│                                     │
│ [Cancel]              [Next Step]   │
└─────────────────────────────────────┘
```

#### Progressive Disclosure Pattern
```
┌─────────────────────────────────────┐
│ ▼ Basic Information                 │
│   [Filled form fields...]          │
│                                     │
│ ▼ Technical Details                 │
│   [Technologies, Methodologies...]  │
│                                     │
│ ▶ Project Outcomes                  │
│ ▶ Reference Information             │
│ ▶ Artifacts & Links                 │
└─────────────────────────────────────┘
```

### 3.3 Search & Filtering

#### Combined Search Pattern
```
┌─────────────────────────────────────┐
│ Search & Filters                    │
├─────────────────────────────────────┤
│ 🔍 [Search projects, clients...]    │
│                                     │
│ Quick Filters:                      │
│ [All] [Active] [Completed] [2024]   │
│                                     │
│ Advanced Filters: [Show ▼]          │
│ ├─ Client: [Select...]              │
│ ├─ Technology: [Multi-select...]    │
│ ├─ Date Range: [From] [To]          │
│ └─ Role: [Select...]                │
│                                     │
│ [Clear Filters]                     │
└─────────────────────────────────────┘
```

### 3.4 Project Detail Views

#### Modal Detail Pattern
```
┌─────────────────────────────────────┐
│ Project Name                    [×] │
├─────────────────────────────────────┤
│ Client: TechCorp                    │
│ Duration: Jan 2024 - Present       │
│ Role: Senior Frontend Developer     │
│                                     │
│ Technologies:                       │
│ [React] [Next.js] [TypeScript]      │
│                                     │
│ Description:                        │
│ [Project description text...]       │
│                                     │
│ Key Achievements:                   │
│ • Improved performance by 40%       │
│ • Reduced bundle size by 25%        │
│                                     │
│ [Edit Project] [Close]              │
└─────────────────────────────────────┘
```

### 3.5 Bulk Operations

#### Selection Pattern
```
┌─────────────────────────────────────┐
│ □ Select All | 3 selected          │
│                                     │
│ Actions: [Export] [Tag] [Delete]    │
├─────────────────────────────────────┤
│ ☑ Project A                        │
│ ☑ Project B                        │
│ ☑ Project C                        │
│ □ Project D                        │
└─────────────────────────────────────┘
```

## 4. Accessibility & Usability Specifications

### 4.1 Keyboard Navigation
```
Tab Order:
1. Main Navigation
2. Search Input
3. Filter Controls
4. Project Cards/Rows
5. Action Buttons
6. Pagination

Keyboard Shortcuts:
- Ctrl+N: New Project
- Ctrl+F: Focus Search
- Escape: Close Modals
- Enter: Activate Focused Element
- Arrow Keys: Navigate Cards/Table
```

### 4.2 Screen Reader Support
```
ARIA Labels:
- role="main" for content area
- role="search" for search section
- role="table" for data tables
- aria-label="Project: {title}" for cards
- aria-expanded for collapsible sections
- aria-live="polite" for search results

Screen Reader Announcements:
- "Loading projects..."
- "Found 12 projects"
- "Project saved successfully"
- "Filter applied: showing 5 projects"
```

### 4.3 Progressive Disclosure
```
Complexity Levels:
1. Quick View: Title, Client, Duration
2. Summary: + Technologies, Role
3. Detailed: + Description, Achievements
4. Full: + All metadata, references

Form Complexity:
1. Required fields only
2. + Common optional fields
3. + Advanced options
4. + Bulk operations
```

### 4.4 Error States & Validation

#### Validation Patterns
```
Real-time Validation:
- Required field indicators (*)
- Inline error messages
- Success indicators (✓)

Error State Hierarchy:
1. Field-level errors (red border + message)
2. Form-level errors (summary at top)
3. System errors (toast notifications)

Example Error States:
┌─────────────────────────────────────┐
│ ⚠ Please correct the following:     │
│ • Project title is required         │
│ • End date must be after start date │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Project Title *                     │
│ [                              ] ❌ │
│ ⚠ This field is required           │
└─────────────────────────────────────┘
```

### 4.5 Mobile Responsive Design

#### Breakpoint Strategy
```
Mobile (320px-768px):
- Stacked cards
- Collapsible filters
- Bottom sheet modals
- Swipe actions

Tablet (768px-1024px):
- 2-column grid
- Side panel filters
- Modal dialogs

Desktop (1024px+):
- 3-column grid
- Persistent filters
- Inline editing
```

#### Mobile Patterns
```
Mobile Card:
┌─────────────────────────┐
│ Project Title           │
│ Client • Role           │
│ Duration                │
│ [Tech] [Tags]           │
│ ⋯ [Actions Menu]        │
└─────────────────────────┘

Mobile Actions:
┌─────────────────────────┐
│ ← Back    Project Name  │
├─────────────────────────┤
│ [Content...]            │
│                         │
│ [Floating Action Button]│
└─────────────────────────┘
```

## 5. Design System Integration (shadcn/ui)

### 5.1 Core shadcn/ui Components

#### Primary Components
```typescript
// Layout & Navigation
- Sheet (for mobile filters)
- Dialog (for modals)
- Tabs (for different views)
- Breadcrumb (for navigation)

// Forms
- Form (with react-hook-form)
- Input (text fields)
- Textarea (descriptions)
- Select (dropdowns)
- DatePicker (date inputs)
- Switch (boolean toggles)
- Checkbox (multi-select)
- RadioGroup (single select)

// Data Display
- Card (project cards)
- Table (project listing)
- Badge (technology tags)
- Avatar (client logos)
- Tooltip (additional info)

// Feedback
- Toast (notifications)
- Alert (error states)
- Progress (loading states)
- Skeleton (loading placeholders)

// Interaction
- Button (actions)
- DropdownMenu (context menus)
- Command (search/filter)
- Pagination (list navigation)
```

### 5.2 Custom Components Needed

#### ProjectCard Component
```typescript
interface ProjectCardProps {
  project: Project;
  view: 'compact' | 'detailed';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

// Features:
// - Responsive layout
// - Technology badges
// - Status indicators
// - Action menu
// - Selection checkbox
// - Accessibility labels
```

#### ProjectForm Component
```typescript
interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<Project>;
  onSubmit: (data: Project) => Promise<void>;
  onCancel: () => void;
  step?: number; // For multi-step flow
}

// Features:
// - Multi-step progression
// - Form validation
// - Auto-save drafts
// - File upload for artifacts
// - Technology autocomplete
// - Date range validation
```

#### SearchFilters Component
```typescript
interface SearchFiltersProps {
  onFiltersChange: (filters: ProjectFilters) => void;
  initialFilters?: ProjectFilters;
  resultCount: number;
  mobile?: boolean;
}

// Features:
// - Real-time search
// - Combined filter logic
// - Filter persistence
// - Clear filters option
// - Mobile-optimized layout
```

#### ProjectTable Component
```typescript
interface ProjectTableProps {
  projects: Project[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (column: string) => void;
  onSelect: (ids: string[]) => void;
  selectedIds: string[];
}

// Features:
// - Sortable columns
// - Row selection
// - Pagination
// - Responsive columns
// - Virtual scrolling (for large lists)
```

### 5.3 Theme Tokens

#### Custom Design Tokens
```css
:root {
  /* Project Status Colors */
  --project-active: hsl(142, 76%, 36%);
  --project-completed: hsl(217, 91%, 60%);
  --project-on-hold: hsl(48, 96%, 53%);

  /* Technology Category Colors */
  --tech-frontend: hsl(262, 83%, 58%);
  --tech-backend: hsl(346, 77%, 49%);
  --tech-database: hsl(48, 96%, 53%);
  --tech-cloud: hsl(200, 98%, 39%);

  /* Component Specific */
  --project-card-border: hsl(var(--border));
  --project-card-hover: hsl(var(--muted));
  --filter-badge-bg: hsl(var(--secondary));

  /* Spacing Scale */
  --space-card-padding: 1.5rem;
  --space-form-gap: 1rem;
  --space-filter-gap: 0.5rem;
}
```

### 5.4 Component Architecture

#### File Structure
```
components/
├── ui/ (shadcn/ui components)
├── projects/
│   ├── ProjectCard.tsx
│   ├── ProjectForm.tsx
│   ├── ProjectTable.tsx
│   ├── ProjectDetail.tsx
│   └── index.ts
├── search/
│   ├── SearchFilters.tsx
│   ├── SearchResults.tsx
│   └── index.ts
├── layout/
│   ├── ProjectLayout.tsx
│   ├── MobileNav.tsx
│   └── index.ts
└── common/
    ├── TechnologyBadge.tsx
    ├── StatusIndicator.tsx
    ├── DateRange.tsx
    └── index.ts
```

## 6. Implementation Guidelines

### 6.1 State Management
```typescript
// Zustand store structure
interface ProjectStore {
  projects: Project[];
  filters: ProjectFilters;
  selectedIds: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProjects: () => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<void>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setFilters: (filters: ProjectFilters) => void;
  setSelected: (ids: string[]) => void;
}
```

### 6.2 API Integration
```typescript
// API endpoints
interface ProjectAPI {
  GET /api/projects?filters={filters}&page={page}
  POST /api/projects
  PUT /api/projects/{id}
  DELETE /api/projects/{id}
  GET /api/projects/{id}/export
  POST /api/projects/bulk-delete
}
```

### 6.3 Performance Optimizations
```typescript
// Virtual scrolling for large lists
// Lazy loading for project details
// Debounced search (300ms)
// Memoized filter functions
// Optimistic updates for UI responsiveness
```

This comprehensive design specification provides a complete foundation for implementing the CV management system's project management flow using Next.js 15 and shadcn/ui components, with full consideration for accessibility, usability, and modern design patterns.