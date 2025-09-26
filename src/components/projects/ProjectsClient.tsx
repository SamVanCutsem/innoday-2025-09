'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { Plus, LayoutGrid, List, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import ProjectCard from './ProjectCard';
import ProjectTable from './ProjectTable';
import SearchFilters from './SearchFilters';
import { Project, ProjectSearchFilters, ProjectViewMode } from '@/types';
import { deleteProject, updateProjectStatus, bulkDeleteProjects } from '@/lib/actions/projects';

const defaultFilters: ProjectSearchFilters = {
  search: '',
  status: [],
  priority: [],
  technologies: [],
  clients: [],
  consultants: [],
  projectTypes: [],
  dateRange: {},
  budgetRange: {},
};

interface ProjectsClientProps {
  initialProjects: Project[];
  projectStats: {
    total: number;
    active: number;
    completed: number;
    planning: number;
  };
}

export default function ProjectsClient({ initialProjects, projectStats }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filters, setFilters] = useState<ProjectSearchFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<ProjectViewMode['type']>('cards');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchLower) ||
          project.description.toLowerCase().includes(searchLower) ||
          project.client.name.toLowerCase().includes(searchLower) ||
          project.consultant.firstName.toLowerCase().includes(searchLower) ||
          project.consultant.lastName.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((project) =>
        filters.status.includes(project.status)
      );
    }

    // Priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter((project) =>
        filters.priority.includes(project.priority)
      );
    }

    // Project type filter
    if (filters.projectTypes.length > 0) {
      filtered = filtered.filter((project) =>
        filters.projectTypes.includes(project.projectType)
      );
    }

    // Technology filter
    if (filters.technologies.length > 0) {
      filtered = filtered.filter((project) =>
        project.technologies.some((tech) =>
          filters.technologies.includes(tech.id)
        )
      );
    }

    // Client filter
    if (filters.clients.length > 0) {
      filtered = filtered.filter((project) =>
        filters.clients.includes(project.client.id)
      );
    }

    // Consultant filter
    if (filters.consultants.length > 0) {
      filtered = filtered.filter((project) =>
        filters.consultants.includes(project.consultant.id)
      );
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter((project) => {
        const projectStart = project.startDate;
        const projectEnd = project.endDate;

        if (filters.dateRange.start && projectEnd < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && projectStart > filters.dateRange.end) {
          return false;
        }
        return true;
      });
    }

    // Budget range filter
    if (filters.budgetRange.min !== undefined || filters.budgetRange.max !== undefined) {
      filtered = filtered.filter((project) => {
        if (!project.budget) return false;
        if (filters.budgetRange.min !== undefined && project.budget < filters.budgetRange.min) {
          return false;
        }
        if (filters.budgetRange.max !== undefined && project.budget > filters.budgetRange.max) {
          return false;
        }
        return true;
      });
    }

    return filtered;
  }, [projects, filters]);

  const handleFiltersChange = (newFilters: ProjectSearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
  };

  const handleStatusChange = (project: Project, status: Project['status']) => {
    startTransition(async () => {
      const result = await updateProjectStatus(project.id, status);
      if (result.success) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === project.id
              ? { ...p, status, updatedAt: new Date() }
              : p
          )
        );
        toast({
          title: 'Project Updated',
          description: `${project.name} status changed to ${status}`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update project status',
          variant: 'destructive',
        });
      }
    });
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      startTransition(async () => {
        const result = await deleteProject(projectToDelete.id);
        if (result.success) {
          setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
          toast({
            title: 'Project Deleted',
            description: `${projectToDelete.name} has been deleted`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error || 'Failed to delete project',
            variant: 'destructive',
          });
        }
        setProjectToDelete(null);
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleBulkDelete = () => {
    if (selectedProjectIds.length === 0) return;

    startTransition(async () => {
      const result = await bulkDeleteProjects(selectedProjectIds);
      if (result.success) {
        setProjects((prev) =>
          prev.filter((p) => !selectedProjectIds.includes(p.id))
        );
        toast({
          title: 'Projects Deleted',
          description: `${result.count} project(s) have been deleted`,
          variant: 'destructive',
        });
        setSelectedProjectIds([]);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete projects',
          variant: 'destructive',
        });
      }
    });
  };

  const handleExportProjects = () => {
    const exportData = selectedProjectIds.length > 0
      ? filteredProjects.filter(p => selectedProjectIds.includes(p.id))
      : filteredProjects;

    console.log('Exporting projects:', exportData);
    toast({
      title: 'Export Started',
      description: `Exporting ${exportData.length} project(s)`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all consultant projects and client engagements
          </p>
        </div>
        <Link href="/projects/new">
          <Button disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{projectStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{projectStats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{projectStats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{projectStats.planning}</div>
            <p className="text-xs text-muted-foreground">Planning</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        resultsCount={filteredProjects.length}
      />

      {/* View Controls and Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="h-8"
              disabled={isPending}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8"
              disabled={isPending}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedProjectIds.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-muted-foreground">
                {selectedProjectIds.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportProjects}
                disabled={isPending}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                className="text-destructive hover:text-destructive"
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportProjects} disabled={isPending}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {filters.search || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f)
                  ? 'Try adjusting your search criteria or filters'
                  : 'Get started by creating your first project'
                }
              </p>
              <Link href="/projects/new">
                <Button disabled={isPending}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteProject}
          onSelectionChange={setSelectedProjectIds}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}