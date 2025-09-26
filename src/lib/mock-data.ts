import {
  Consultant,
  Technology,
  Client,
  Project,
  ProjectMilestone,
  TimeEntry,
  ProjectAttachment
} from '@/types';

// Mock Technologies
export const mockTechnologies: Technology[] = [
  { id: '1', name: 'React', category: 'frontend', color: '#61DAFB' },
  { id: '2', name: 'Next.js', category: 'frontend', color: '#000000' },
  { id: '3', name: 'TypeScript', category: 'frontend', color: '#3178C6' },
  { id: '4', name: 'Node.js', category: 'backend', color: '#339933' },
  { id: '5', name: 'Python', category: 'backend', color: '#3776AB' },
  { id: '6', name: 'PostgreSQL', category: 'database', color: '#336791' },
  { id: '7', name: 'MongoDB', category: 'database', color: '#47A248' },
  { id: '8', name: 'AWS', category: 'cloud', color: '#232F3E' },
  { id: '9', name: 'Azure', category: 'cloud', color: '#0078D4' },
  { id: '10', name: 'Docker', category: 'devops', color: '#2496ED' },
  { id: '11', name: 'Kubernetes', category: 'devops', color: '#326CE5' },
  { id: '12', name: 'React Native', category: 'mobile', color: '#61DAFB' },
  { id: '13', name: 'Flutter', category: 'mobile', color: '#02569B' },
  { id: '14', name: 'Java', category: 'backend', color: '#007396' },
  { id: '15', name: 'C#', category: 'backend', color: '#239120' },
  { id: '16', name: 'Angular', category: 'frontend', color: '#DD0031' },
  { id: '17', name: 'Vue.js', category: 'frontend', color: '#4FC08D' },
  { id: '18', name: 'GraphQL', category: 'backend', color: '#E10098' },
  { id: '19', name: 'Redis', category: 'database', color: '#DC382D' },
  { id: '20', name: 'Terraform', category: 'devops', color: '#7B42BC' },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    size: 'large',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, San Francisco, CA 94105',
    website: 'https://techcorp.com',
    logo: '/logos/techcorp.png',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-09-20'),
  },
  {
    id: '2',
    name: 'FinanceMax Inc',
    industry: 'Financial Services',
    size: 'enterprise',
    contactPerson: 'Michael Chen',
    email: 'michael.chen@financemax.com',
    phone: '+1-555-0234',
    address: '456 Wall Street, New York, NY 10005',
    website: 'https://financemax.com',
    logo: '/logos/financemax.png',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-09-15'),
  },
  {
    id: '3',
    name: 'HealthTech Innovations',
    industry: 'Healthcare',
    size: 'medium',
    contactPerson: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@healthtech.com',
    phone: '+1-555-0345',
    address: '789 Medical Center Blvd, Boston, MA 02101',
    website: 'https://healthtech-innovations.com',
    logo: '/logos/healthtech.png',
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2024-09-10'),
  },
  {
    id: '4',
    name: 'EduLearn Platform',
    industry: 'Education',
    size: 'startup',
    contactPerson: 'James Wilson',
    email: 'james.wilson@edulearn.com',
    phone: '+1-555-0456',
    address: '321 University Ave, Palo Alto, CA 94301',
    website: 'https://edulearn.com',
    logo: '/logos/edulearn.png',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-09-25'),
  },
  {
    id: '5',
    name: 'RetailGenius',
    industry: 'Retail',
    size: 'large',
    contactPerson: 'Lisa Thompson',
    email: 'lisa.thompson@retailgenius.com',
    phone: '+1-555-0567',
    address: '654 Commerce Drive, Chicago, IL 60601',
    website: 'https://retailgenius.com',
    logo: '/logos/retailgenius.png',
    createdAt: new Date('2023-07-12'),
    updatedAt: new Date('2024-09-18'),
  },
];

// Mock Consultants
export const mockConsultants: Consultant[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@xebia.com',
    phone: '+1-555-1001',
    avatar: '/avatars/john-smith.jpg',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    skills: [mockTechnologies[0], mockTechnologies[1], mockTechnologies[2]], // React, Next.js, TypeScript
    experience: 8,
    certifications: ['AWS Certified Developer', 'React Professional'],
    availability: 'available',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2024-09-20'),
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@xebia.com',
    phone: '+1-555-1002',
    avatar: '/avatars/maria-garcia.jpg',
    title: 'Full Stack Developer',
    department: 'Engineering',
    skills: [mockTechnologies[3], mockTechnologies[4], mockTechnologies[5]], // Node.js, Python, PostgreSQL
    experience: 6,
    certifications: ['Google Cloud Professional', 'Python Advanced'],
    availability: 'busy',
    createdAt: new Date('2022-06-20'),
    updatedAt: new Date('2024-09-15'),
  },
  {
    id: '3',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@xebia.com',
    phone: '+1-555-1003',
    avatar: '/avatars/david-kim.jpg',
    title: 'Cloud Solutions Architect',
    department: 'Cloud Services',
    skills: [mockTechnologies[7], mockTechnologies[8], mockTechnologies[9]], // AWS, Azure, Docker
    experience: 12,
    certifications: ['AWS Solutions Architect', 'Azure Architect Expert', 'CKAD'],
    availability: 'available',
    createdAt: new Date('2021-03-10'),
    updatedAt: new Date('2024-09-22'),
  },
  {
    id: '4',
    firstName: 'Sophie',
    lastName: 'Brown',
    email: 'sophie.brown@xebia.com',
    phone: '+1-555-1004',
    avatar: '/avatars/sophie-brown.jpg',
    title: 'Mobile App Developer',
    department: 'Mobile',
    skills: [mockTechnologies[11], mockTechnologies[12]], // React Native, Flutter
    experience: 5,
    certifications: ['React Native Certified', 'Flutter Developer'],
    availability: 'available',
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2024-09-18'),
  },
  {
    id: '5',
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@xebia.com',
    phone: '+1-555-1005',
    avatar: '/avatars/alex-johnson.jpg',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    skills: [mockTechnologies[9], mockTechnologies[10], mockTechnologies[19]], // Docker, Kubernetes, Terraform
    experience: 7,
    certifications: ['CKA', 'Terraform Associate', 'AWS DevOps'],
    availability: 'unavailable',
    createdAt: new Date('2022-04-18'),
    updatedAt: new Date('2024-09-12'),
  },
];

// Mock Project Milestones
const createMockMilestones = (projectId: string): ProjectMilestone[] => [
  {
    id: `${projectId}-m1`,
    title: 'Project Kickoff & Requirements Gathering',
    description: 'Initial project setup and stakeholder meetings',
    dueDate: new Date('2024-10-15'),
    completed: true,
    completedAt: new Date('2024-10-14'),
    deliverables: ['Requirements Document', 'Project Charter', 'Team Setup'],
  },
  {
    id: `${projectId}-m2`,
    title: 'Design & Architecture Phase',
    description: 'System design and technical architecture',
    dueDate: new Date('2024-11-01'),
    completed: true,
    completedAt: new Date('2024-10-30'),
    deliverables: ['System Architecture', 'UI/UX Designs', 'Database Schema'],
  },
  {
    id: `${projectId}-m3`,
    title: 'Development Phase 1',
    description: 'Core functionality implementation',
    dueDate: new Date('2024-12-15'),
    completed: false,
    deliverables: ['Core Features', 'API Endpoints', 'Database Implementation'],
  },
  {
    id: `${projectId}-m4`,
    title: 'Testing & Quality Assurance',
    description: 'Comprehensive testing and bug fixes',
    dueDate: new Date('2025-01-15'),
    completed: false,
    deliverables: ['Test Cases', 'Bug Reports', 'Performance Tests'],
  },
];

// Mock Time Entries
const createMockTimeEntries = (projectId: string): TimeEntry[] => [
  {
    id: `${projectId}-t1`,
    date: new Date('2024-10-01'),
    hours: 8,
    description: 'Initial project setup and requirements analysis',
    billable: true,
    approved: true,
    createdAt: new Date('2024-10-01'),
  },
  {
    id: `${projectId}-t2`,
    date: new Date('2024-10-02'),
    hours: 6,
    description: 'Stakeholder meetings and documentation',
    billable: true,
    approved: true,
    createdAt: new Date('2024-10-02'),
  },
  {
    id: `${projectId}-t3`,
    date: new Date('2024-10-03'),
    hours: 7.5,
    description: 'Technical architecture design',
    billable: true,
    approved: false,
    createdAt: new Date('2024-10-03'),
  },
];

// Mock Project Attachments
const createMockAttachments = (projectId: string): ProjectAttachment[] => [
  {
    id: `${projectId}-a1`,
    name: 'Requirements_Document.pdf',
    url: '/attachments/requirements.pdf',
    type: 'application/pdf',
    size: 2048000,
    uploadedAt: new Date('2024-10-01'),
    uploadedBy: 'john.smith@xebia.com',
  },
  {
    id: `${projectId}-a2`,
    name: 'Technical_Specifications.docx',
    url: '/attachments/tech-specs.docx',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 1536000,
    uploadedAt: new Date('2024-10-15'),
    uploadedBy: 'maria.garcia@xebia.com',
  },
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Modernization',
    description: 'Complete overhaul of the existing e-commerce platform using modern React stack with improved performance and user experience.',
    client: mockClients[0],
    consultant: mockConsultants[0],
    status: 'active',
    priority: 'high',
    technologies: [mockTechnologies[0], mockTechnologies[1], mockTechnologies[2], mockTechnologies[5]],
    startDate: new Date('2024-10-01'),
    endDate: new Date('2025-02-28'),
    estimatedHours: 800,
    actualHours: 120,
    budget: 120000,
    invoiceAmount: 18000,
    projectType: 'development',
    deliverables: [
      'Modernized frontend application',
      'Performance optimization',
      'Mobile responsive design',
      'SEO improvements',
      'Admin dashboard'
    ],
    risks: [
      'Integration with legacy payment system',
      'Data migration complexity',
      'Third-party API dependencies'
    ],
    notes: 'Client has requested additional security features for PCI compliance.',
    attachments: createMockAttachments('1'),
    milestones: createMockMilestones('1'),
    timeEntries: createMockTimeEntries('1'),
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-10-03'),
  },
  {
    id: '2',
    name: 'Financial Dashboard Analytics',
    description: 'Development of a comprehensive financial analytics dashboard with real-time data visualization and reporting capabilities.',
    client: mockClients[1],
    consultant: mockConsultants[1],
    status: 'planning',
    priority: 'urgent',
    technologies: [mockTechnologies[0], mockTechnologies[3], mockTechnologies[5], mockTechnologies[17]],
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-03-31'),
    estimatedHours: 600,
    actualHours: 0,
    budget: 90000,
    projectType: 'development',
    deliverables: [
      'Real-time analytics dashboard',
      'Custom reporting system',
      'Data visualization components',
      'API integration',
      'User management system'
    ],
    risks: [
      'Complex data requirements',
      'Real-time performance challenges',
      'Regulatory compliance needs'
    ],
    notes: 'Requires SOC 2 compliance and extensive security measures.',
    attachments: createMockAttachments('2'),
    milestones: createMockMilestones('2'),
    timeEntries: [],
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-25'),
  },
  {
    id: '3',
    name: 'Healthcare Data Migration',
    description: 'Migration of legacy healthcare data systems to modern cloud infrastructure with improved security and compliance.',
    client: mockClients[2],
    consultant: mockConsultants[2],
    status: 'active',
    priority: 'high',
    technologies: [mockTechnologies[7], mockTechnologies[9], mockTechnologies[5], mockTechnologies[4]],
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-12-31'),
    estimatedHours: 500,
    actualHours: 180,
    budget: 75000,
    invoiceAmount: 27000,
    projectType: 'consulting',
    deliverables: [
      'Data migration strategy',
      'Cloud infrastructure setup',
      'Security implementation',
      'Compliance documentation',
      'Staff training'
    ],
    risks: [
      'HIPAA compliance requirements',
      'Data integrity during migration',
      'Downtime minimization'
    ],
    notes: 'Critical project with strict compliance requirements.',
    attachments: createMockAttachments('3'),
    milestones: createMockMilestones('3'),
    timeEntries: createMockTimeEntries('3'),
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-10-01'),
  },
  {
    id: '4',
    name: 'Educational Mobile App',
    description: 'Development of a cross-platform mobile application for online learning with interactive features and offline capability.',
    client: mockClients[3],
    consultant: mockConsultants[3],
    status: 'completed',
    priority: 'medium',
    technologies: [mockTechnologies[11], mockTechnologies[3], mockTechnologies[6]],
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-09-30'),
    estimatedHours: 400,
    actualHours: 420,
    budget: 60000,
    invoiceAmount: 63000,
    projectType: 'development',
    deliverables: [
      'Cross-platform mobile app',
      'Offline content capability',
      'User progress tracking',
      'Interactive learning modules',
      'Admin content management'
    ],
    risks: [
      'App store approval process',
      'Performance on older devices',
      'Content delivery optimization'
    ],
    notes: 'Successfully launched with positive user feedback.',
    attachments: createMockAttachments('4'),
    milestones: createMockMilestones('4'),
    timeEntries: createMockTimeEntries('4'),
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-09-30'),
  },
  {
    id: '5',
    name: 'Retail Inventory System',
    description: 'Implementation of a modern inventory management system with real-time tracking and predictive analytics.',
    client: mockClients[4],
    consultant: mockConsultants[0],
    status: 'on-hold',
    priority: 'low',
    technologies: [mockTechnologies[0], mockTechnologies[3], mockTechnologies[5], mockTechnologies[7]],
    startDate: new Date('2024-08-15'),
    endDate: new Date('2025-01-31'),
    estimatedHours: 700,
    actualHours: 60,
    budget: 105000,
    invoiceAmount: 9000,
    projectType: 'development',
    deliverables: [
      'Inventory tracking system',
      'Predictive analytics dashboard',
      'Mobile companion app',
      'Integration with existing ERP',
      'Reporting and analytics'
    ],
    risks: [
      'ERP system integration complexity',
      'Data accuracy requirements',
      'Scalability for multiple locations'
    ],
    notes: 'Project paused due to client budget constraints.',
    attachments: createMockAttachments('5'),
    milestones: createMockMilestones('5'),
    timeEntries: createMockTimeEntries('5'),
    createdAt: new Date('2024-07-20'),
    updatedAt: new Date('2024-08-30'),
  },
  {
    id: '6',
    name: 'DevOps Infrastructure Audit',
    description: 'Comprehensive audit and optimization of existing DevOps infrastructure with recommendations for improvement.',
    client: mockClients[0],
    consultant: mockConsultants[4],
    status: 'completed',
    priority: 'medium',
    technologies: [mockTechnologies[9], mockTechnologies[10], mockTechnologies[19], mockTechnologies[7]],
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-08-31'),
    estimatedHours: 200,
    actualHours: 185,
    budget: 30000,
    invoiceAmount: 27750,
    projectType: 'audit',
    deliverables: [
      'Infrastructure audit report',
      'Security assessment',
      'Performance optimization plan',
      'Cost reduction recommendations',
      'Implementation roadmap'
    ],
    risks: [
      'Minimal downtime requirements',
      'Legacy system dependencies',
      'Team training needs'
    ],
    notes: 'Audit completed successfully with 25% cost reduction achieved.',
    attachments: createMockAttachments('6'),
    milestones: createMockMilestones('6'),
    timeEntries: createMockTimeEntries('6'),
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-08-31'),
  },
];

// Helper functions for filtering and searching
export const getProjectsByStatus = (status: Project['status']) =>
  mockProjects.filter(project => project.status === status);

export const getProjectsByConsultant = (consultantId: string) =>
  mockProjects.filter(project => project.consultant.id === consultantId);

export const getProjectsByClient = (clientId: string) =>
  mockProjects.filter(project => project.client.id === clientId);

export const getProjectsByTechnology = (technologyId: string) =>
  mockProjects.filter(project =>
    project.technologies.some(tech => tech.id === technologyId)
  );

export const searchProjects = (query: string) =>
  mockProjects.filter(project =>
    project.name.toLowerCase().includes(query.toLowerCase()) ||
    project.description.toLowerCase().includes(query.toLowerCase()) ||
    project.client.name.toLowerCase().includes(query.toLowerCase()) ||
    project.consultant.firstName.toLowerCase().includes(query.toLowerCase()) ||
    project.consultant.lastName.toLowerCase().includes(query.toLowerCase())
  );

// Default export for convenience
export default {
  projects: mockProjects,
  consultants: mockConsultants,
  clients: mockClients,
  technologies: mockTechnologies,
};