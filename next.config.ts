import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";

const nextConfig: NextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["next-image-export-optimizer"],
  // Enable static export for deployment
  output: 'export',
  // Configure images for next-image-export-optimizer
  images: {
    loader: 'custom',
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Environment variable for next-image-export-optimizer
  env: {
    nextImageExportOptimizer_imageFolderPath: "public",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "optimized",
    nextImageExportOptimizer_generateAndUseBlurImages: "true",
  },
  // Optionally, add any other Next.js config below
};

const prettyCodeOptions: Options = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
  defaultLang: "plaintext",
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{type: 'text', value: ' '}];
    }
  },
  onVisitHighlightedLine(node: any) {
    // Add highlighted line class
    if (!node.properties.className) {
      node.properties.className = [];
    }
    node.properties.className.push('line--highlighted');
  },
  onVisitHighlightedChars(node: any) {
    // Add highlighted chars class
    node.properties.className = ['word--highlighted'];
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
