import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectForm from '@/components/projects/ProjectForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { mockProjects } from '@/lib/mock-data';

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `Edit ${project.name} - Consultant Management System`,
    description: `Edit project details for ${project.name}`,
  };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href={`/projects/${id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground mt-2">
          Update the project details for {project.name}.
        </p>
      </div>

      <ProjectForm mode="edit" project={project} />
    </div>
  );
}

export async function generateStaticParams() {
  return mockProjects.map((project) => ({
    id: project.id,
  }));
}