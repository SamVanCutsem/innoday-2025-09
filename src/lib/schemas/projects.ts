import { z } from 'zod';

// Base schema without refinements for reusability
const baseProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Project name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description is too long'),
  clientId: z.string().min(1, 'Please select a client'),
  consultantId: z.string().min(1, 'Please select a consultant'),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  technologies: z.array(z.string()).min(1, 'Please select at least one technology'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  estimatedHours: z.number().min(1, 'Estimated hours must be at least 1').max(10000, 'Estimated hours is too high'),
  budget: z.number().optional(),
  projectType: z.enum(['development', 'consulting', 'audit', 'training', 'support', 'other']),
  deliverables: z.array(z.string()).min(1, 'Please add at least one deliverable'),
  risks: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

// Date validation refinement function for create schema
const dateValidationRefinement = (data: { startDate: string; endDate: string }) => {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
};

// Date validation refinement function for update schema (with optional fields)
const updateDateValidationRefinement = (data: { startDate?: string; endDate?: string }) => {
  if (!data.startDate || !data.endDate) {
    return true; // Skip validation if either date is missing
  }
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  return endDate > startDate;
};

// Form validation schemas with refinements
export const createProjectSchema = baseProjectSchema.refine(dateValidationRefinement, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateProjectSchema = baseProjectSchema.extend({
  id: z.string().min(1, 'Project ID is required'),
}).partial().required({ id: true }).refine(updateDateValidationRefinement, {
  message: 'End date must be after start date',
  path: ['endDate'],
});