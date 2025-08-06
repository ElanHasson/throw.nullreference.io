import { readdir } from "fs/promises";
import path from "path";
import { Post } from "../[slug]/_queries/get-post";

export async function getAllPosts(includeDrafts = false) {
  const postsPath = path.join(process.cwd(), "private/blogs");

  // Get all blog directories
  const entries = (await readdir(postsPath, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  // Retrieve metadata from MDX files
  const posts = await Promise.all(
    entries.map(async (slug) => {
      const { metadata } = await import(`@/private/blogs/${slug}/index.mdx`);
      return { slug, ...metadata };
    })
  );

  // Filter out drafts if not including them
  const filteredPosts = includeDrafts 
    ? posts 
    : posts.filter(post => !post.draft);

  // Sort posts from newest to oldest
  filteredPosts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return filteredPosts as Post[];
}
