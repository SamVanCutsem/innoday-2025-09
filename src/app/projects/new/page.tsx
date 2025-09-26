import { Metadata } from 'next';
import ProjectForm from '@/components/projects/ProjectForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'New Project - Consultant Management System',
  description: 'Create a new project assignment for consultants.',
};

export default function NewProjectPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the project details to create a new consulting assignment.
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}