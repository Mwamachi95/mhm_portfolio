import { client } from '@/lib/sanity'
import { ProjectsGrid } from '@/components/projects/ProjectsGrid'

interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

interface SanityProject {
  _id: string
  title: string
  slug: { current: string }
  category: string
  description?: string
  thumbnail?: SanityImage
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  description?: string
  thumbnail?: SanityImage
}

export default async function ProjectsPage() {
  const sanityProjects = await client.fetch<SanityProject[]>(
    `*[_type == "project"] | order(date desc) {
      _id,
      title,
      slug,
      category,
      description,
      thumbnail
    }`
  )

  const projects: Project[] = sanityProjects.map((project) => ({
    id: project._id,
    title: project.title,
    slug: project.slug?.current || '',
    category: project.category,
    description: project.description,
    thumbnail: project.thumbnail,
  }))

  return <ProjectsGrid projects={projects} />
}
