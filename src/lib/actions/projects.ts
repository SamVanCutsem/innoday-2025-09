'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Project, CreateProjectFormData } from '@/types';
import { mockProjects, mockClients, mockConsultants, mockTechnologies } from '@/lib/mock-data';
import { createProjectSchema, updateProjectSchema } from '@/lib/schemas/projects';

// In a real application, this would be a database
let projects: Project[] = [...mockProjects];

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// Helper function to convert form data to project
function formDataToProject(data: CreateProjectFormData, id?: string): Project {
  const client = mockClients.find(c => c.id === data.clientId);
  const consultant = mockConsultants.find(c => c.id === data.consultantId);
  const technologies = mockTechnologies.filter(t => data.technologies.includes(t.id));

  if (!client || !consultant) {
    throw new Error('Invalid client or consultant ID');
  }

  const now = new Date();

  return {
    id: id || generateId(),
    name: data.name,
    description: data.description,
    client,
    consultant,
    status: data.status,
    priority: data.priority,
    technologies,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    estimatedHours: data.estimatedHours,
    actualHours: 0,
    budget: data.budget,
    projectType: data.projectType,
    deliverables: data.deliverables,
    risks: data.risks || [],
    notes: data.notes,
    attachments: [],
    milestones: [],
    timeEntries: [],
    createdAt: id ? projects.find(p => p.id === id)?.createdAt || now : now,
    updatedAt: now,
  };
}

// Action to create a new project
export async function createProject(formData: FormData) {
  try {
    // Extract and parse form data
    const rawData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      clientId: formData.get('clientId') as string,
      consultantId: formData.get('consultantId') as string,
      status: formData.get('status') as Project['status'],
      priority: formData.get('priority') as Project['priority'],
      technologies: JSON.parse(formData.get('technologies') as string || '[]'),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      estimatedHours: parseInt(formData.get('estimatedHours') as string),
      budget: formData.get('budget') ? parseInt(formData.get('budget') as string) : undefined,
      projectType: formData.get('projectType') as Project['projectType'],
      deliverables: JSON.parse(formData.get('deliverables') as string || '[]'),
      risks: JSON.parse(formData.get('risks') as string || '[]'),
      notes: formData.get('notes') as string || undefined,
    };

    // Validate the data
    const validatedData = createProjectSchema.parse(rawData);

    // Create the project
    const newProject = formDataToProject(validatedData);
    projects.push(newProject);

    // Revalidate and redirect
    revalidatePath('/projects');
    redirect('/projects');
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Action to update an existing project
export async function updateProject(formData: FormData) {
  try {
    const projectId = formData.get('id') as string;

    // Extract and parse form data
    const rawData = {
      id: projectId,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      clientId: formData.get('clientId') as string,
      consultantId: formData.get('consultantId') as string,
      status: formData.get('status') as Project['status'],
      priority: formData.get('priority') as Project['priority'],
      technologies: JSON.parse(formData.get('technologies') as string || '[]'),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      estimatedHours: parseInt(formData.get('estimatedHours') as string),
      budget: formData.get('budget') ? parseInt(formData.get('budget') as string) : undefined,
      projectType: formData.get('projectType') as Project['projectType'],
      deliverables: JSON.parse(formData.get('deliverables') as string || '[]'),
      risks: JSON.parse(formData.get('risks') as string || '[]'),
      notes: formData.get('notes') as string || undefined,
    };

    // Validate the data
    const validatedData = updateProjectSchema.parse(rawData);

    // Find and update the project
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    const updatedProject = formDataToProject(validatedData as CreateProjectFormData, projectId);
    projects[projectIndex] = updatedProject;

    // Revalidate and redirect
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);
    redirect(`/projects/${projectId}`);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Action to delete a project
export async function deleteProject(projectId: string) {
  try {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    projects.splice(projectIndex, 1);

    // Revalidate the projects page
    revalidatePath('/projects');

    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Action to update project status
export async function updateProjectStatus(projectId: string, status: Project['status']) {
  try {
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      status,
      updatedAt: new Date(),
    };

    // Revalidate the projects page
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error('Error updating project status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Action to bulk delete projects
export async function bulkDeleteProjects(projectIds: string[]) {
  try {
    projects = projects.filter(p => !projectIds.includes(p.id));

    // Revalidate the projects page
    revalidatePath('/projects');

    return { success: true, count: projectIds.length };
  } catch (error) {
    console.error('Error bulk deleting projects:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to get all projects (for use in Server Components)
export async function getProjects(): Promise<Project[]> {
  // In a real app, this would be a database query
  return projects;
}

// Function to get a single project by ID
export async function getProject(id: string): Promise<Project | null> {
  // In a real app, this would be a database query
  return projects.find(p => p.id === id) || null;
}

// Function to get project statistics
export async function getProjectStats() {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const planningProjects = projects.filter(p => p.status === 'planning').length;
  const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalInvoiced = projects.reduce((sum, p) => sum + (p.invoiceAmount || 0), 0);
  const totalHours = projects.reduce((sum, p) => sum + (p.actualHours || 0), 0);
  const totalEstimatedHours = projects.reduce((sum, p) => sum + p.estimatedHours, 0);

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    planningProjects,
    onHoldProjects,
    totalBudget,
    totalInvoiced,
    totalHours,
    totalEstimatedHours,
  };
}