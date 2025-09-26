'use client';

import Link from 'next/link';
import {
  Calendar,
  User,
  Building2,
  Clock,
  DollarSign,
  Edit,
  MoreHorizontal,
  ArrowLeft,
  FileText,
  AlertTriangle,
  CheckSquare,
  Target,
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectDetailProps {
  project: Project;
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

export default function ProjectDetail({ project, className }: ProjectDetailProps) {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const completedMilestones = project.milestones.filter(m => m.completed).length;
  const totalMilestones = project.milestones.length;
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const totalTimeLogged = project.timeEntries.reduce((total, entry) => total + entry.hours, 0);
  const billableHours = project.timeEntries.filter(entry => entry.billable).reduce((total, entry) => total + entry.hours, 0);

  return (
    <div className={cn('container mx-auto p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <p className="text-muted-foreground text-lg">{project.description}</p>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Badge variant={status.variant} className="shrink-0">
              {status.label}
            </Badge>
            <Link href={`/projects/${project.id}/edit`}>
              <Button size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <Progress value={progressPercentage} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Hours</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{project.actualHours || 0}</div>
              <div className="text-sm text-muted-foreground">
                of {project.estimatedHours} estimated
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Milestones</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">{completedMilestones}/{totalMilestones}</div>
              <div className="text-sm text-muted-foreground">
                {Math.round(milestoneProgress)}% complete
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Budget</span>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-bold">
                {project.budget ? formatCurrency(project.budget) : 'N/A'}
              </div>
              {project.invoiceAmount && (
                <div className="text-sm text-muted-foreground">
                  {formatCurrency(project.invoiceAmount)} invoiced
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="time">Time Tracking</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Project Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Project Type</span>
                      <p className="capitalize">{project.projectType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Priority</span>
                      <p className={cn('font-medium capitalize', priority.color)}>
                        {priority.label}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Start Date</span>
                      <p>{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">End Date</span>
                      <p>{formatDate(project.endDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technologies */}
              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech.id} variant="outline">
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Risks */}
              {project.risks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Project Risks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {project.risks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-600" />
                          <span className="text-sm">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {project.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{project.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              {project.milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckSquare
                            className={cn(
                              'h-4 w-4',
                              milestone.completed ? 'text-green-600' : 'text-muted-foreground'
                            )}
                          />
                          <h4 className="font-medium">{milestone.title}</h4>
                          {milestone.completed && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {milestone.description}
                          </p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Due: {formatDate(milestone.dueDate)}
                          {milestone.completed && milestone.completedAt && (
                            <span> • Completed: {formatDate(milestone.completedAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="time" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Time Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Total Logged</span>
                      <p className="text-lg font-bold">{totalTimeLogged}h</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Billable Hours</span>
                      <p className="text-lg font-bold">{billableHours}h</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Estimated</span>
                      <p className="text-lg font-bold">{project.estimatedHours}h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {project.timeEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{entry.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{formatDate(entry.date)}</span>
                          <span>{entry.hours}h</span>
                          {entry.billable && (
                            <Badge variant="outline" className="text-xs">
                              Billable
                            </Badge>
                          )}
                          {entry.approved && (
                            <Badge variant="secondary" className="text-xs">
                              Approved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="files" className="space-y-4">
              {project.attachments.map((attachment) => (
                <Card key={attachment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB •
                            Uploaded {formatDate(attachment.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium">{project.client.name}</h4>
                <p className="text-sm text-muted-foreground">{project.client.industry}</p>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span>{project.client.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="truncate">{project.client.email}</span>
                </div>
                {project.client.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{project.client.phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company Size</span>
                  <span className="capitalize">{project.client.size}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consultant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Consultant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={project.consultant.avatar} />
                  <AvatarFallback>
                    {getInitials(project.consultant.firstName, project.consultant.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">
                    {project.consultant.firstName} {project.consultant.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {project.consultant.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {project.consultant.experience} years experience
                  </p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {project.consultant.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="outline" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                  {project.consultant.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.consultant.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Add Time Entry
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}