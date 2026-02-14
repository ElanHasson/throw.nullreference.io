import { MDXContent } from "mdx/types";

type Author = {
  name: string;
  bio: string;
  avatar: string;
};

type SEO = {
  metaTitle: string;
  metaDescription: string;
};

export type PostMetadata = {
  title: string;
  featuredImage?: string;
  publishDate: string;
  lastModified?: string;
  author: Author;
  excerpt: string;
  tags: string[];
  categories?: string[];
  seo: SEO;
  featured?: boolean;
  series?: string;
  description?: string;
  draft?: boolean;
};

export type Post = PostMetadata & {
  slug: string;
  content: MDXContent;
};

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await import(`@/private/blogs/${slug}/index.mdx`);

    return {
      slug,
      ...post.metadata,
      content: post.default,
    } as Post;
  } catch (error) {
    console.error("Error loading blog post:", error);
    return null;
  }
}
