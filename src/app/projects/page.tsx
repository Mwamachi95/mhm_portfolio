import { Suspense } from 'react'
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

// Loading fallback for the projects grid
function ProjectsGridSkeleton() {
  return (
    <main className="min-h-screen bg-background pt-32 md:pt-40 pb-20">
      <div className="px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          {/* Filter bar skeleton */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-20 bg-foreground/10 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-7xl">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/3] bg-foreground/10 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
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

  return (
    <Suspense fallback={<ProjectsGridSkeleton />}>
      <ProjectsGrid projects={projects} />
    </Suspense>
  )
}
