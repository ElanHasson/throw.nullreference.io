import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamic imports for all blog posts
const blogPosts: Record<string, () => Promise<any>> = {
  'adding-iis-features-to-an-aws-elastic-bean-stalk-net-container': () =>
    import('../adding-iis-features-to-an-aws-elastic-bean-stalk-net-container/page.mdx'),
  'attaboys-and-mediocrity-in-the-modern-workplace-the-war-against-meritocracy': () =>
    import('../attaboys-and-mediocrity-in-the-modern-workplace-the-war-against-meritocracy/page.mdx'),
  'building-a-distributed-task-scheduler-on-digitalocean-app-platform': () =>
    import('../building-a-distributed-task-scheduler-on-digitalocean-app-platform/page.mdx'),
  'do-developers-still-care-about-hardware-resources-do-their-managers': () =>
    import('../do-developers-still-care-about-hardware-resources-do-their-managers/page.mdx'),
  'hello-world': () => import('../hello-world/page.mdx'),
  'keep-your-visual-basic-6-application-in-active-development-for-the-next-10-years': () =>
    import('../keep-your-visual-basic-6-application-in-active-development-for-the-next-10-years/page.mdx'),
  'learning-go': () => import('../learning-go/page.mdx'),
  'vibe-coding-nextjs-blog-with-claude': () => import('../vibe-coding-nextjs-blog-with-claude/page.mdx'),
  'webscheduler-part-2-doing-the-design': () => import('../webscheduler-part-2-doing-the-design/page.mdx'),
  'wsl-is-just-linux': () => import('../wsl-is-just-linux/page.mdx'),
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const postLoader = blogPosts[slug]
  if (!postLoader) {
    notFound()
  }

  const Post = dynamic(postLoader, {
    loading: () => <div>Loading...</div>,
  })

  return <Post />
}