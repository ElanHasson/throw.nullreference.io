import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPost } from "./_queries/get-post";
import Breadcrumb from "@/components/breadcrumb";
import { FeaturedImage } from "@/components/featured-image";

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
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <Breadcrumb 
        items={[
          { label: 'Blog', href: '/blog' }, 
          { label: post.title }
        ]} 
      />

      <article className="animate-fade-in">
        <header className="mb-12 text-center">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <time className="font-medium text-rose-600 dark:text-rose-400">
              {format(new Date(post.publishDate), 'LLLL d, yyyy')}
            </time>
            
            {post.featured && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-800 dark:bg-rose-900 dark:text-rose-200">
                Featured
              </span>
            )}
          </div>

          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-300">
              {post.excerpt}
            </p>
          )}

          {post.featuredImage && (
            <FeaturedImage
              src={post.featuredImage}
              alt={post.title}
              variant="hero"
              priority
              className="mb-12 rounded-2xl shadow-2xl"
            />
          )}
        </header>

        <section className="prose prose-lg prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:leading-relaxed prose-a:text-rose-600 prose-a:no-underline hover:prose-a:text-rose-700 hover:prose-a:underline prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-rose-600 prose-pre:bg-gray-900 prose-pre:text-gray-100 dark:prose-a:text-rose-400 dark:hover:prose-a:text-rose-300 dark:prose-code:bg-gray-800 dark:prose-code:text-rose-400 dark:prose-pre:bg-gray-950">
          <Content />
        </section>

        <footer className="mt-16 space-y-8">
          {/* Author Bio */}
          {post.author && (
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 dark:from-gray-800 dark:to-gray-900">
              <div className="flex items-start gap-6">
                {post.author.avatar && (
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="rounded-full object-cover shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold">
                    Written by {post.author.name}
                  </h3>
                  {post.author.bio && (
                    <p className="text-gray-600 dark:text-gray-300">
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
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-rose-700 hover:scale-105 hover:shadow-lg"
            >
              <svg 
                className="h-4 w-4" 
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
  
  const postsDirectory = join(process.cwd(), 'private/posts');
  const filenames = readdirSync(postsDirectory);
  
  return filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => ({
      slug: filename.replace('.mdx', '')
    }));
}
