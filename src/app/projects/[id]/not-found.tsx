import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The project you are looking for doesn't exist or may have been removed.
        </p>
        <Link href="/projects">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>
    </div>
  );
}