# Library

This directory contains shared utilities and type definitions for the blog application.

## Structure

- `types.ts` - TypeScript type definitions
- `posts.ts` - Blog post utility functions
- `index.ts` - Main exports

## Usage

```typescript
// Import types
import type { PostMeta } from '@/lib/types'

// Import utilities
import { getAllPosts, getRecentPosts } from '@/lib/posts'

// Or import everything
import { getAllPosts, type PostMeta } from '@/lib'
```

## Type Generation

This project uses Next.js automatic type generation. TypeScript types are automatically generated for:

- Page components (`.next/types/app/`)
- Route parameters
- Metadata exports

To regenerate types, run:

```bash
yarn build
# or
yarn typecheck
```
