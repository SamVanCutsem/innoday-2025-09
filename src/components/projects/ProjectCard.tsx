'use client';

import Link from 'next/link';
import { Calendar, User, Building2, Clock, DollarSign, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onStatusChange?: (project: Project, status: Project['status']) => void;
  className?: string;
}

const statusConfig = {
  planning: { color: 'bg-blue-500', label: 'Planning', variant: 'secondary' as const },
  active: { color: 'bg-green-500', label: 'Active', variant: 'default' as const },
  'on-hold': { color: 'bg-yellow-500', label: 'On Hold', variant: 'outline' as const },
  completed: { color: 'bg-gray-500', label: 'Completed', variant: 'secondary' as const },
  cancelled: { color: 'bg-red-500', label: 'Cancelled', variant: 'destructive' as const },
};

const priorityConfig = {
  low: { color: 'text-green-600', label: 'Low' },
  medium: { color: 'text-yellow-600', label: 'Medium' },
  high: { color: 'text-orange-600', label: 'High' },
  urgent: { color: 'text-red-600', label: 'Urgent' },
};

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onStatusChange,
  className
}: ProjectCardProps) {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const progressPercentage = project.estimatedHours > 0
    ? Math.round(((project.actualHours || 0) / project.estimatedHours) * 100)
    : 0;

  return (
    <Card className={cn('group hover:shadow-md transition-shadow duration-200', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/projects/${project.id}`}>
              <h3 className="font-semibold text-lg leading-tight hover:text-primary transition-colors truncate">
                {project.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant={status.variant} className="shrink-0">
              {status.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
                </DropdownMenuItem>
                {onStatusChange && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onStatusChange(project, 'active')}
                      disabled={project.status === 'active'}
                    >
                      Mark as Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(project, 'on-hold')}
                      disabled={project.status === 'on-hold'}
                    >
                      Put on Hold
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onStatusChange(project, 'completed')}
                      disabled={project.status === 'completed'}
                    >
                      Mark as Completed
                    </DropdownMenuItem>
                  </>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(project)}
                      className="text-destructive"
                    >
                      Delete Project
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Client and Consultant Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{project.client.name}</p>
              <p className="text-xs text-muted-foreground">{project.client.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.consultant.avatar} />
              <AvatarFallback className="text-xs">
                {getInitials(project.consultant.firstName, project.consultant.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">
                {project.consultant.firstName} {project.consultant.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{project.consultant.title}</p>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech.id} variant="outline" className="text-xs">
              {tech.name}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {project.actualHours || 0}h / {project.estimatedHours}h ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t bg-muted/30">
        <div className="flex items-center justify-between w-full text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            <div className={cn('flex items-center gap-1 font-medium', priority.color)}>
              <Clock className="h-3 w-3" />
              <span>{priority.label}</span>
            </div>
          </div>
          {project.budget && (
            <div className="flex items-center gap-1 font-medium">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span>{formatCurrency(project.budget)}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}