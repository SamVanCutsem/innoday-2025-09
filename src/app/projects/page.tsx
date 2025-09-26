import { Suspense } from 'react';
import { Metadata } from 'next';
import ProjectsPage from '@/components/projects/ProjectsPage';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Projects - Consultant Management System',
  description: 'Manage and track all consultant projects, clients, and assignments.',
};

function ProjectsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsPage />
    </Suspense>
  );
}