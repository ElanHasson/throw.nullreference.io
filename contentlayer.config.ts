import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const PostMeta = defineDocumentType(() => ({
  name: 'PostMeta',
  filePathPattern: `**/*.mdx`,
  contentType: 'markdown', // Keep as markdown but disable MDX compilation below
  fields: {
    title: { 
      type: 'string', 
      required: true,
      description: 'The title of the post'
    },
    date: { 
      type: 'date', 
      required: true,
      description: 'The date of the post'
    },
    description: { 
      type: 'string', 
      required: false,
      description: 'A short description of the post'
    },
    thumbnail: { 
      type: 'string', 
      required: false,
      description: 'The thumbnail image for the post'
    },
    tags: { 
      type: 'list', 
      of: { type: 'string' }, 
      default: [],
      description: 'Tags for the post'
    },
    categories: { 
      type: 'list', 
      of: { type: 'string' }, 
      default: [],
      description: 'Categories for the post'
    },
    draft: { 
      type: 'boolean', 
      default: false,
      description: 'Whether the post is a draft'
    },
    featured: { 
      type: 'boolean', 
      default: false,
      description: 'Whether the post is featured'
    },
    series: { 
      type: 'string', 
      required: false,
      description: 'The series this post belongs to'
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath,
    },
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
    readingTime: {
      type: 'json',
      resolve: (post) => {
        const wordsPerMinute = 200
        const words = post.body.raw.split(/\s+/g).length
        const minutes = Math.ceil(words / wordsPerMinute)
        return {
          text: `${minutes} min read`,
          minutes,
          words
        }
      },
    },
    wordCount: {
      type: 'number',
      resolve: (post) => post.body.raw.split(/\s+/g).length,
    },
    headings: {
      type: 'json',
      resolve: (post) => {
        const headingRegex = /^(#{1,6})\s+(.+)$/gm
        const headings = []
        let match
        while ((match = headingRegex.exec(post.body.raw)) !== null) {
          headings.push({
            level: match[1].length,
            text: match[2]
          })
        }
        return headings
      }
    }
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [PostMeta],
  disableImportAliasWarning: true,
  mdx: {
    // Minimal MDX configuration - just for frontmatter extraction
    remarkPlugins: [],
    rehypePlugins: [],
  },
})