import { getConsultants, getConsultantStats } from '@/lib/actions/consultants';
import ConsultantsClient from './ConsultantsClient';

export default async function ConsultantsPage() {
  // Fetch data on the server
  const [consultants, stats] = await Promise.all([
    getConsultants(),
    getConsultantStats(),
  ]);

  // Calculate simplified stats for the client
  const consultantStats = {
    total: stats.totalConsultants,
    available: stats.availableConsultants,
    busy: stats.busyConsultants,
    unavailable: stats.unavailableConsultants,
  };

  return (
    <ConsultantsClient
      initialConsultants={consultants}
      consultantStats={consultantStats}
    />
  );
}