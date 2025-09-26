'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createProject, updateProject } from '@/lib/actions/projects';
import { createProjectSchema } from '@/lib/schemas/projects';
import { CalendarDays, Users, Building2, Cpu, DollarSign, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project, CreateProjectFormData } from '@/types';
import { mockClients, mockConsultants, mockTechnologies } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type ProjectFormData = z.infer<typeof createProjectSchema>;

interface ProjectFormProps {
  mode: 'create' | 'edit';
  project?: Project;
  onSubmit?: (data: ProjectFormData) => void;
  onCancel?: () => void;
  className?: string;
}

const statusOptions = [
  { value: 'planning', label: 'Planning', description: 'Project is in planning phase' },
  { value: 'active', label: 'Active', description: 'Project is currently active' },
  { value: 'on-hold', label: 'On Hold', description: 'Project is temporarily paused' },
  { value: 'completed', label: 'Completed', description: 'Project has been completed' },
  { value: 'cancelled', label: 'Cancelled', description: 'Project has been cancelled' },
] as const;

const priorityOptions = [
  { value: 'low', label: 'Low', description: 'Low priority project' },
  { value: 'medium', label: 'Medium', description: 'Medium priority project' },
  { value: 'high', label: 'High', description: 'High priority project' },
  { value: 'urgent', label: 'Urgent', description: 'Urgent priority project' },
] as const;

const projectTypeOptions = [
  { value: 'development', label: 'Development', description: 'Software development project' },
  { value: 'consulting', label: 'Consulting', description: 'Consulting engagement' },
  { value: 'audit', label: 'Audit', description: 'System or process audit' },
  { value: 'training', label: 'Training', description: 'Training and education' },
  { value: 'support', label: 'Support', description: 'Support and maintenance' },
  { value: 'other', label: 'Other', description: 'Other type of project' },
] as const;

export default function ProjectForm({
  mode,
  project,
  onSubmit,
  onCancel,
  className
}: ProjectFormProps) {
  const router = useRouter();
  const [deliverableInput, setDeliverableInput] = useState('');
  const [riskInput, setRiskInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert project data to form data for editing
  const getDefaultValues = (): Partial<ProjectFormData> => {
    if (mode === 'edit' && project) {
      return {
        name: project.name,
        description: project.description,
        clientId: project.client.id,
        consultantId: project.consultant.id,
        status: project.status,
        priority: project.priority,
        technologies: project.technologies.map(t => t.id),
        startDate: project.startDate.toISOString().split('T')[0],
        endDate: project.endDate.toISOString().split('T')[0],
        estimatedHours: project.estimatedHours,
        budget: project.budget,
        projectType: project.projectType,
        deliverables: project.deliverables,
        risks: project.risks,
        notes: project.notes,
      };
    }
    return {
      status: 'planning',
      priority: 'medium',
      projectType: 'development',
      technologies: [],
      deliverables: [],
      risks: [],
    };
  };

  const form = useForm<ProjectFormData>({
    // @ts-ignore - Temporary fix for react-hook-form type conflict
    resolver: zodResolver(createProjectSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const handleSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Create FormData for Server Action
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });

        // If editing, add the project ID
        if (mode === 'edit' && project) {
          formData.append('id', project.id);
        }

        // Call the appropriate Server Action
        if (mode === 'create') {
          await createProject(formData);
        } else {
          await updateProject(formData);
        }
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  const addDeliverable = () => {
    if (deliverableInput.trim()) {
      const current = form.getValues('deliverables') || [];
      form.setValue('deliverables', [...current, deliverableInput.trim()]);
      setDeliverableInput('');
    }
  };

  const removeDeliverable = (index: number) => {
    const current = form.getValues('deliverables') || [];
    form.setValue('deliverables', current.filter((_, i) => i !== index));
  };

  const addRisk = () => {
    if (riskInput.trim()) {
      const current = form.getValues('risks') || [];
      form.setValue('risks', [...current, riskInput.trim()]);
      setRiskInput('');
    }
  };

  const removeRisk = (index: number) => {
    const current = form.getValues('risks') || [];
    form.setValue('risks', current.filter((_, i) => i !== index));
  };

  const watchedDeliverables = form.watch('deliverables') || [];
  const watchedRisks = form.watch('risks') || [];
  const watchedTechnologies = form.watch('technologies') || [];

  return (
    <div className={cn('max-w-4xl mx-auto', className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="risks">Risks & Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the fundamental details about the project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      // @ts-ignore - Temporary fix for react-hook-form type conflict
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter project name..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the project objectives, scope, and key requirements..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of the project (10-1000 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Client
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockClients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  <div className="flex flex-col">
                                    <span>{client.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {client.industry}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consultantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Consultant
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a consultant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockConsultants.map((consultant) => (
                                <SelectItem key={consultant.id} value={consultant.id}>
                                  <div className="flex flex-col">
                                    <span>{consultant.firstName} {consultant.lastName}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {consultant.title}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Project Details
                  </CardTitle>
                  <CardDescription>
                    Define timeline, budget, and technical requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projectTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.description}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estimatedHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Hours</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="400"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormDescription>
                            Total estimated hours for project completion
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Budget (USD)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="100000"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            Total project budget in USD (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="technologies"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="flex items-center gap-2">
                            <Cpu className="h-4 w-4" />
                            Technologies
                          </FormLabel>
                          <FormDescription>
                            Select the technologies that will be used in this project
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {mockTechnologies.map((tech) => (
                            <FormField
                              key={tech.id}
                              control={form.control}
                              name="technologies"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={tech.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(tech.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, tech.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== tech.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                      {tech.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedTechnologies.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Technologies</Label>
                      <div className="flex flex-wrap gap-2">
                        {watchedTechnologies.map((techId) => {
                          const tech = mockTechnologies.find(t => t.id === techId);
                          return tech ? (
                            <Badge key={tech.id} variant="secondary">
                              {tech.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Deliverables</CardTitle>
                  <CardDescription>
                    Define what will be delivered as part of this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter a deliverable..."
                      value={deliverableInput}
                      onChange={(e) => setDeliverableInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addDeliverable();
                        }
                      }}
                    />
                    <Button type="button" onClick={addDeliverable}>
                      Add
                    </Button>
                  </div>

                  {watchedDeliverables.length > 0 && (
                    <div className="space-y-2">
                      <Label>Deliverables ({watchedDeliverables.length})</Label>
                      <div className="space-y-2">
                        {watchedDeliverables.map((deliverable, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span className="text-sm">{deliverable}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDeliverable(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {watchedDeliverables.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No deliverables added yet. Add at least one deliverable to continue.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risks & Additional Notes
                  </CardTitle>
                  <CardDescription>
                    Identify potential risks and add any additional project notes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Project Risks</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter a potential risk..."
                        value={riskInput}
                        onChange={(e) => setRiskInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRisk();
                          }
                        }}
                      />
                      <Button type="button" onClick={addRisk}>
                        Add Risk
                      </Button>
                    </div>

                    {watchedRisks.length > 0 && (
                      <div className="space-y-2">
                        {watchedRisks.map((risk, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 border-yellow-200"
                          >
                            <span className="text-sm">{risk}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRisk(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <FormField
                    // @ts-ignore - Temporary fix for react-hook-form type conflict
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional notes, requirements, or special considerations..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional notes that don't fit in other categories
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Updating...'
                : mode === 'create'
                ? 'Create Project'
                : 'Update Project'
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}