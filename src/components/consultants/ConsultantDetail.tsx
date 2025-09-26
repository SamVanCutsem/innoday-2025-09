'use client';

import Link from 'next/link';
import {
  Calendar,
  Mail,
  Phone,
  Building2,
  Award,
  Edit,
  ArrowLeft,
  Briefcase,
  User,
  Star,
  Clock,
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
import { Consultant } from '@/types';
import { cn } from '@/lib/utils';
import { mockProjects } from '@/lib/mock-data';

interface ConsultantDetailProps {
  consultant: Consultant;
  className?: string;
}

const availabilityConfig = {
  available: { color: 'bg-green-500', label: 'Available', variant: 'default' as const },
  busy: { color: 'bg-yellow-500', label: 'Busy', variant: 'secondary' as const },
  unavailable: { color: 'bg-red-500', label: 'Unavailable', variant: 'destructive' as const },
};

export default function ConsultantDetail({ consultant, className }: ConsultantDetailProps) {
  const availability = availabilityConfig[consultant.availability];
  const initials = `${consultant.firstName.charAt(0)}${consultant.lastName.charAt(0)}`;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get consultant's projects
  const consultantProjects = mockProjects.filter(p => p.consultant.id === consultant.id);
  const activeProjects = consultantProjects.filter(p => p.status === 'active');
  const completedProjects = consultantProjects.filter(p => p.status === 'completed');

  // Calculate utilization metrics
  const totalProjects = consultantProjects.length;
  const totalHours = consultantProjects.reduce((sum, p) => sum + (p.actualHours || 0), 0);
  const totalRevenue = consultantProjects.reduce((sum, p) => sum + (p.invoiceAmount || 0), 0);

  // Group skills by category
  const skillsByCategory = consultant.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof consultant.skills>);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn('container mx-auto p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <Link href="/consultants">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Consultants
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={consultant.avatar} alt={`${consultant.firstName} ${consultant.lastName}`} />
              <AvatarFallback className="text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">
                {consultant.firstName} {consultant.lastName}
              </h1>
              <p className="text-xl text-muted-foreground">{consultant.title}</p>
              {consultant.department && (
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                  <Building2 className="mr-1 h-4 w-4" />
                  {consultant.department}
                </p>
              )}
              <div className="flex items-center mt-2">
                <Badge variant={availability.variant} className="text-sm">
                  <div className={cn('w-2 h-2 rounded-full mr-2', availability.color)} />
                  {availability.label}
                </Badge>
              </div>
            </div>
          </div>
          <Link href={`/consultants/${consultant.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Consultant
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{totalProjects}</p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                    <p className="text-2xl font-bold text-green-600">{activeProjects.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Projects worked on by {consultant.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {consultantProjects.length === 0 ? (
                    <p className="text-muted-foreground">No projects assigned yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {consultantProjects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <Link href={`/projects/${project.id}`}>
                              <h4 className="font-medium hover:text-primary cursor-pointer">
                                {project.name}
                              </h4>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {project.client.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                                {project.status}
                              </Badge>
                              {project.technologies.slice(0, 3).map((tech) => (
                                <Badge key={tech.id} variant="outline" className="text-xs">
                                  {tech.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {project.actualHours || 0}h logged
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(project.startDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                  <CardDescription>
                    Technologies and skills mastered by {consultant.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <div key={category}>
                        <h4 className="font-medium mb-3 capitalize">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                            <Badge
                              key={skill.id}
                              variant="outline"
                              className="text-sm"
                              style={{ borderColor: skill.color, color: skill.color }}
                            >
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Achievements</CardTitle>
                  <CardDescription>
                    Professional certifications earned by {consultant.firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {consultant.certifications.length === 0 ? (
                    <p className="text-muted-foreground">No certifications listed.</p>
                  ) : (
                    <div className="space-y-3">
                      {consultant.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Award className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{cert}</p>
                            <p className="text-sm text-muted-foreground">
                              Professional Certification
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Recent updates and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Profile Updated</p>
                        <p className="text-sm text-muted-foreground">
                          Last updated on {formatDate(consultant.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Joined Company</p>
                        <p className="text-sm text-muted-foreground">
                          Member since {formatDate(consultant.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{consultant.email}</p>
                </div>
              </div>
              {consultant.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{consultant.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">{consultant.experience} years</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Project Completion Rate</span>
                  <span>{totalProjects > 0 ? Math.round((completedProjects.length / totalProjects) * 100) : 0}%</span>
                </div>
                <Progress value={totalProjects > 0 ? (completedProjects.length / totalProjects) * 100 : 0} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Current Workload</span>
                  <span>{activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}</span>
                </div>
                <Progress value={Math.min((activeProjects.length / 3) * 100, 100)} />
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm">
                  <p className="font-medium">Total Hours Logged</p>
                  <p className="text-2xl font-bold">{totalHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/consultants/${consultant.id}/edit`}>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Resume
              </Button>
              <Link href={`/projects/new?consultant=${consultant.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Assign Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}