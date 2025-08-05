import { readdir } from "fs/promises";
import path from "path";
import { Post } from "../[slug]/_queries/get-post";

export async function getAllPosts() {
  const postsPath = path.join(process.cwd(), "private/posts");

  // Get all MDX files
  const files = (await readdir(postsPath, { withFileTypes: true }))
    .filter((file) => file.isFile() && file.name.endsWith(".mdx"))
    .map((file) => file.name);

  // Retrieve metadata from MDX files
  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, ""); // Remove .mdx extension to get slug
      const { metadata } = await import(`@/private/posts/${filename}`);
      return { slug, ...metadata };
    })
  );

  // Sort posts from newest to oldest
  posts.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return posts as Post[];
}
