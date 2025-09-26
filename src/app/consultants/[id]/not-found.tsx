import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ConsultantNotFound() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-xl font-semibold">Consultant Not Found</h2>
            <p className="text-muted-foreground max-w-md">
              The consultant you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/consultants">
                <Button>
                  View All Consultants
                </Button>
              </Link>
              <Link href="/consultants/new">
                <Button variant="outline">
                  Add New Consultant
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}