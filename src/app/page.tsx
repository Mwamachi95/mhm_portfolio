import { HomeContent } from '@/components/HomeContent';
import { ProjectsShowcaseWrapper } from '@/components/sections/ProjectsShowcaseWrapper';

export default function Home() {
  return <HomeContent projectsShowcase={<ProjectsShowcaseWrapper />} />;
}
