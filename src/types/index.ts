// Core types for the consultant project management system

export interface Consultant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  title: string;
  department?: string;
  skills: Technology[];
  experience: number; // years
  certifications: string[];
  availability: 'available' | 'busy' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
}

export interface Technology {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'mobile' | 'devops' | 'other';
  color?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  contactPerson: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: Client;
  consultant: Consultant;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  technologies: Technology[];
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  actualHours?: number;
  budget?: number;
  invoiceAmount?: number;
  projectType: 'development' | 'consulting' | 'audit' | 'training' | 'support' | 'other';
  deliverables: string[];
  risks: string[];
  notes?: string;
  attachments: ProjectAttachment[];
  milestones: ProjectMilestone[];
  timeEntries: TimeEntry[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  deliverables: string[];
}

export interface TimeEntry {
  id: string;
  date: Date;
  hours: number;
  description: string;
  billable: boolean;
  approved: boolean;
  createdAt: Date;
}

// Search and filter types
export interface ProjectSearchFilters {
  search: string;
  status: Project['status'][];
  priority: Project['priority'][];
  technologies: string[];
  clients: string[];
  consultants: string[];
  projectTypes: Project['projectType'][];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  budgetRange: {
    min?: number;
    max?: number;
  };
}

export interface SortConfig {
  key: keyof Project | 'client.name' | 'consultant.firstName';
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

// UI state types
export interface ProjectViewMode {
  type: 'cards' | 'table' | 'list';
}

export interface ProjectBulkActions {
  selectedIds: string[];
  action: 'delete' | 'updateStatus' | 'assignConsultant' | 'addTechnology' | 'export';
}

// Form types
export interface CreateProjectFormData {
  name: string;
  description: string;
  clientId: string;
  consultantId: string;
  status: Project['status'];
  priority: Project['priority'];
  technologies: string[];
  startDate: string;
  endDate: string;
  estimatedHours: number;
  budget?: number;
  projectType: Project['projectType'];
  deliverables: string[];
  risks: string[];
  notes?: string;
}

export interface UpdateProjectFormData extends Partial<CreateProjectFormData> {
  id: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: PaginationConfig;
  filters: ProjectSearchFilters;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Statistics and dashboard types
export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  avgProjectDuration: number;
  topTechnologies: Array<{
    technology: Technology;
    count: number;
  }>;
  topClients: Array<{
    client: Client;
    projectCount: number;
    revenue: number;
  }>;
  consultantUtilization: Array<{
    consultant: Consultant;
    activeProjects: number;
    utilization: number;
  }>;
}

// Types are already exported above with the interface declarations