// Core types for the consultant project management system

// Gravatar and Avatar types
export interface GravatarOptions {
  size?: number;
  defaultImage?: 'mp' | 'identicon' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'blank' | string;
  rating?: 'g' | 'pg' | 'r' | 'x';
  forceDefault?: boolean;
}

export interface AvatarProps {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  size?: number;
  className?: string;
  gravatarOptions?: Omit<GravatarOptions, 'size'>;
}

// Certification types
export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expirationDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  category: CertificationCategory;
  level: CertificationLevel;
  status: CertificationStatus;
  verificationStatus: VerificationStatus;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CertificationCategory =
  | 'cloud'
  | 'development'
  | 'security'
  | 'data'
  | 'devops'
  | 'management'
  | 'design'
  | 'other';

export type CertificationLevel =
  | 'foundational'
  | 'associate'
  | 'professional'
  | 'expert'
  | 'specialist';

export type CertificationStatus =
  | 'active'
  | 'expired'
  | 'expiring_soon'
  | 'revoked';

export type VerificationStatus =
  | 'verified'
  | 'pending'
  | 'unverified'
  | 'failed';

export interface CertificationFilter {
  search?: string;
  categories?: CertificationCategory[];
  levels?: CertificationLevel[];
  status?: CertificationStatus[];
  verificationStatus?: VerificationStatus[];
  issuingOrganizations?: string[];
  expiringWithinDays?: number;
}

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
  certifications: Certification[];
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

// Consultant search and filter types
export interface ConsultantSearchFilters {
  search: string;
  availability: Consultant['availability'][];
  skills: string[];
  departments: string[];
  experienceRange: {
    min?: number;
    max?: number;
  };
}

// UI state types
export interface ProjectViewMode {
  type: 'cards' | 'table' | 'list';
}

export interface ConsultantViewMode {
  type: 'cards' | 'table' | 'list';
}

export interface ProjectBulkActions {
  selectedIds: string[];
  action: 'delete' | 'updateStatus' | 'assignConsultant' | 'addTechnology' | 'export';
}

export interface ConsultantBulkActions {
  selectedIds: string[];
  action: 'delete' | 'updateAvailability' | 'addSkill' | 'export';
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

export interface CreateConsultantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title: string;
  department?: string;
  skills: string[];
  experience: number;
  certifications: string[];
  availability: Consultant['availability'];
  notes?: string;
}

export interface UpdateConsultantFormData extends Partial<CreateConsultantFormData> {
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
  planningProjects: number;
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

export interface ConsultantStats {
  totalConsultants: number;
  availableConsultants: number;
  busyConsultants: number;
  unavailableConsultants: number;
  avgExperience: number;
  topSkills: Array<{
    technology: Technology;
    count: number;
  }>;
  departmentBreakdown: Array<{
    department: string;
    count: number;
  }>;
  experienceDistribution: Array<{
    range: string;
    count: number;
  }>;
}

// Types are already exported above with the interface declarations