import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/projects/ProjectDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { mockProjects } from '@/lib/mock-data';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.name} - Consultant Management System`,
    description: project.description,
  };
}

function ProjectDetailLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <Suspense fallback={<ProjectDetailLoading />}>
      <ProjectDetail project={project} />
    </Suspense>
  );
}

export async function generateStaticParams() {
  return mockProjects.map((project) => ({
    id: project.id,
  }));
}