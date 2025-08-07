# Claude Memory - Throwin' Exceptions Blog

## Project Overview
This is a Next.js 15 blog for throw.nullreference.io with MDX support, dark mode, search functionality, and a modern design.

## Recent Work Summary

### Wide Screen Layout Improvements
- Updated all container widths from `max-w-4xl` to `max-w-7xl` for better wide screen support
- Added responsive padding (`lg:px-8`) to containers
- Updated the following pages for wide screen displays:
  - `/blog` - Grid layout with 2-5 columns based on screen size
  - `/series` - Grid layout with cards
  - `/topics` - Already had two-column layout
  - `/archive` - Maintained timeline style with wider container
  - Header component - Updated to use full width

### Dynamic Blog Mosaic Layout
- Replaced standard grid with dynamic tile/mosaic layout
- Post cards now vary in width based on:
  - First post with image spans 2 columns
  - Posts with long titles (>40 chars) without images span 2 columns
  - Posts with images and long descriptions can span wider
  - Posts with many tags and long descriptions span wider
- Posts without featured images show gradient backgrounds instead of placeholder images
- All featured images and placeholder areas are clickable links

### Key Technical Details
- Using CSS Grid with dynamic column spans (`col-span-1`, `col-span-2`, etc.)
- Grid is responsive: `md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5`
- Featured images use the `FeaturedImage` component with size variants
- URL encoding uses `encodeURIComponent()` for all dynamic routes

### User Preferences
- Direct communication style preferred
- Wants to see actual changes, not explanations
- Prefers dynamic, modern layouts over static grids
- Values efficient use of space

## File Locations
- Blog page: `/app/blog/page.tsx`
- Series page: `/app/series/page.tsx`
- Topics page: `/app/topics/page.tsx`
- Archive page: `/app/archive/page.tsx`
- Header: `/components/header.tsx`
- Featured Image component: `/components/featured-image.tsx`
- Blog posts: `/content/posts/*.mdx`

## Next Steps
- All requested wide screen and dynamic layout improvements have been completed
- The blog now has a modern mosaic/Pinterest-style layout with responsive design