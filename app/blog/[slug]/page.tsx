import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "./_queries/get-post";

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
    <article className="mx-auto py-20 max-w-screen-md">
      <header className="text-center">
        <p className="mb-8 text-sm text-muted-foreground">
          {new Date(post.publishDate).toLocaleDateString([], {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="text-4xl">{post.title}</h1>
        <p className="mb-4 text-lg text-muted-foreground">{post.excerpt}</p>

        {post.featuredImage && (
          <div className="relative mb-8 h-64 w-full md:h-[500px]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}
      </header>

      <section className="prose prose-lg prose-li:mb-2 prose-ul:mt-4 hover:prose-a:text-primary hover:prose-a:decoration-primary prose-a:underline prose-p:mt-2 prose-p:mb-4 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-2">
        <Content />
      </section>

      <footer className="mt-16">
        <div className="flex items-center gap-4 rounded-lg border p-6">
          {post.author.avatar && (
            <div className="relative h-16 w-16 flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            {post.author.bio && (
              <p className="text-sm text-muted-foreground">{post.author.bio}</p>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
