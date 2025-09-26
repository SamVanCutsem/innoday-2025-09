import { getProjects, getProjectStats } from '@/lib/actions/projects';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  // Fetch data on the server
  const [projects, stats] = await Promise.all([
    getProjects(),
    getProjectStats(),
  ]);

  // Calculate simplified stats for the client
  const projectStats = {
    total: stats.totalProjects,
    active: stats.activeProjects,
    completed: stats.completedProjects,
    planning: stats.planningProjects,
  };

  return (
    <ProjectsClient
      initialProjects={projects}
      projectStats={projectStats}
    />
  );
}