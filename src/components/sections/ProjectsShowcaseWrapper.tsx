import { client } from '@/lib/sanity'
import { ProjectsShowcase } from './ProjectsShowcase'

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
  thumbnail?: SanityImage
}

export async function ProjectsShowcaseWrapper() {
  // Fetch all projects from Sanity
  const sanityProjects = await client.fetch<SanityProject[]>(
    `*[_type == "project"] | order(date desc) {
      _id,
      title,
      slug,
      category,
      thumbnail
    }`
  )

  // Map Sanity projects to ProjectCard format
  const projects = sanityProjects.map((project) => ({
    id: project._id,
    title: project.title,
    slug: project.slug?.current || '',
    category: project.category,
    thumbnail: project.thumbnail,
  }))

  return <ProjectsShowcase projects={projects} />
}
