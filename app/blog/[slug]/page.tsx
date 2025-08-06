import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPost } from "./_queries/get-post";
import Breadcrumb from "@/components/breadcrumb";
import { FeaturedImage } from "@/components/featured-image";
import { OptimizedImage } from "@/components/optimized-image";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const Content = post.content;

  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-20 lg:py-24">
      <div className="mb-12">
        <Breadcrumb 
          items={[
            { label: 'Blog', href: '/blog' }, 
            { label: post.title }
          ]} 
        />
      </div>

      <article className="animate-fade-in">
        <header className="mb-16 text-center">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-sm">
            <time className="font-medium text-rose-600 dark:text-rose-400">
              {format(new Date(post.publishDate), 'LLLL d, yyyy')}
            </time>
            
            {post.featured && (
              <span className="rounded-full bg-rose-100 px-4 py-2 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                Featured
              </span>
            )}
          </div>

          <h1 className="mb-8 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 dark:text-gray-300">
              {post.excerpt}
            </p>
          )}

          {post.featuredImage && (
            <div className="mb-16">
              <FeaturedImage
                src={post.featuredImage}
                alt={post.title}
                variant="hero"
                priority
                className="rounded-2xl shadow-2xl"
              />
            </div>
          )}
        </header>

        <section className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-headings:scroll-mt-20 prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4 prose-p:leading-relaxed prose-p:mb-6 prose-a:text-rose-600 prose-a:no-underline hover:prose-a:text-rose-700 hover:prose-a:underline prose-code:rounded prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:text-rose-600 prose-blockquote:border-l-rose-500 prose-blockquote:bg-rose-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-ul:my-8 prose-ol:my-8 prose-li:my-2 dark:prose-a:text-rose-400 dark:hover:prose-a:text-rose-300 dark:prose-code:bg-gray-800 dark:prose-code:text-rose-400 dark:prose-blockquote:bg-rose-950/20 dark:prose-blockquote:border-l-rose-400">
          <Content />
        </section>

        <footer className="mt-20 space-y-12">
          {/* Author Bio */}
          {post.author && (
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-10 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-start gap-8">
                {post.author.avatar && (
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <OptimizedImage
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="mb-4 text-2xl font-bold">
                    Written by {post.author.name}
                  </h3>
                  {post.author.bio && (
                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 rounded-full bg-rose-600 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-rose-700 hover:scale-105 hover:shadow-lg"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16l-4-4m0 0l4-4m-4 4h18" 
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  const { readdirSync } = await import('fs');
  const { join } = await import('path');
  
  const postsDirectory = join(process.cwd(), 'private/blogs');
  const entries = readdirSync(postsDirectory, { withFileTypes: true });
  
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => ({
      slug: entry.name
    }));
}
