import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client, urlFor } from '@/lib/sanity'
import { ProjectDetail } from '@/components/projects/ProjectDetail'

interface SanityImage {
  _type: 'image'
  _key?: string
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

interface SanityBlock {
  _type: 'block'
  _key: string
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _type: string
    _key: string
    href?: string
  }>
  style?: string
  listItem?: 'bullet' | 'number'
  level?: number
}

interface SanityProject {
  _id: string
  title: string
  slug: { current: string }
  category: string
  date: string
  description?: string
  websiteUrl?: string
  heroImage?: SanityImage
  thumbnail?: SanityImage
  gallery?: SanityImage[]
  problem?: SanityBlock[]
  context?: SanityBlock[]
  solution?: SanityBlock[]
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  date: string
  description?: string
  websiteUrl?: string
  heroImage?: SanityImage
  thumbnail?: SanityImage
  gallery?: SanityImage[]
  problem?: SanityBlock[]
  context?: SanityBlock[]
  solution?: SanityBlock[]
}

export interface ProjectNavigation {
  previous: { title: string; slug: string; category: string; thumbnail?: SanityImage } | null
  next: { title: string; slug: string; category: string; thumbnail?: SanityImage } | null
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string): Promise<SanityProject | null> {
  return client.fetch<SanityProject | null>(
    `*[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      category,
      date,
      description,
      websiteUrl,
      heroImage,
      thumbnail,
      gallery,
      problem,
      context,
      solution
    }`,
    { slug }
  )
}

async function getAllProjects(): Promise<Array<{ title: string; slug: { current: string }; category: string; thumbnail?: SanityImage }>> {
  return client.fetch(
    `*[_type == "project"] | order(date desc) {
      title,
      slug,
      category,
      thumbnail
    }`
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const heroImageUrl = project.heroImage
    ? urlFor(project.heroImage).width(1200).height(630).url()
    : project.thumbnail
      ? urlFor(project.thumbnail).width(1200).height(630).url()
      : undefined

  return {
    title: project.title,
    description: project.description || `${project.title} - A ${project.category} project by Heinz Mwamachi`,
    openGraph: {
      title: project.title,
      description: project.description || `${project.title} - A ${project.category} project by Heinz Mwamachi`,
      images: heroImageUrl ? [{ url: heroImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || `${project.title} - A ${project.category} project by Heinz Mwamachi`,
      images: heroImageUrl ? [heroImageUrl] : [],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const [sanityProject, allProjects] = await Promise.all([
    getProject(slug),
    getAllProjects(),
  ])

  if (!sanityProject) {
    notFound()
  }

  // Transform Sanity project to our Project type
  const project: Project = {
    id: sanityProject._id,
    title: sanityProject.title,
    slug: sanityProject.slug.current,
    category: sanityProject.category,
    date: sanityProject.date,
    description: sanityProject.description,
    websiteUrl: sanityProject.websiteUrl,
    heroImage: sanityProject.heroImage,
    thumbnail: sanityProject.thumbnail,
    gallery: sanityProject.gallery,
    problem: sanityProject.problem,
    context: sanityProject.context,
    solution: sanityProject.solution,
  }

  // Find current project index and determine prev/next
  const currentIndex = allProjects.findIndex((p) => p.slug.current === slug)

  const navigation: ProjectNavigation = {
    previous: currentIndex > 0
      ? {
          title: allProjects[currentIndex - 1].title,
          slug: allProjects[currentIndex - 1].slug.current,
          category: allProjects[currentIndex - 1].category,
          thumbnail: allProjects[currentIndex - 1].thumbnail,
        }
      : null,
    next: currentIndex < allProjects.length - 1
      ? {
          title: allProjects[currentIndex + 1].title,
          slug: allProjects[currentIndex + 1].slug.current,
          category: allProjects[currentIndex + 1].category,
          thumbnail: allProjects[currentIndex + 1].thumbnail,
        }
      : null,
  }

  return <ProjectDetail project={project} navigation={navigation} />
}
