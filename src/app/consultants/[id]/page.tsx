import { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ConsultantDetail from '@/components/consultants/ConsultantDetail';
import { getConsultant } from '@/lib/actions/consultants';
import { Skeleton } from '@/components/ui/skeleton';

interface ConsultantPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ConsultantPageProps): Promise<Metadata> {
  const consultant = await getConsultant(params.id);

  if (!consultant) {
    return {
      title: 'Consultant Not Found',
    };
  }

  return {
    title: `${consultant.firstName} ${consultant.lastName} - Consultant Management System`,
    description: `View details for ${consultant.firstName} ${consultant.lastName}, ${consultant.title} at ${consultant.department || 'our company'}.`,
  };
}

function ConsultantLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}

export default async function ConsultantPage({ params }: ConsultantPageProps) {
  const consultant = await getConsultant(params.id);

  if (!consultant) {
    notFound();
  }

  return (
    <Suspense fallback={<ConsultantLoading />}>
      <ConsultantDetail consultant={consultant} />
    </Suspense>
  );
}