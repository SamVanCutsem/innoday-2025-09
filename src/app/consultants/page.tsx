import { Suspense } from 'react';
import { Metadata } from 'next';
import ConsultantsPage from '@/components/consultants/ConsultantsPage';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Consultants - Consultant Management System',
  description: 'Manage and track all consultants, their skills, availability, and assignments.',
};

function ConsultantsLoading() {
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
    <Suspense fallback={<ConsultantsLoading />}>
      <ConsultantsPage />
    </Suspense>
  );
}