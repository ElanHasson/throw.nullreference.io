import type { MDXComponents } from "mdx/types";
import { CTACard } from "./app/blog/_components/cta-card";
import { Figure } from "./components/mdx/figure";
import { Alert } from "./components/mdx/alert";
import { MermaidDiagram } from "./components/mdx/mermaid";
import { Pre } from "./components/mdx/pre";
import { GistEmbed } from "./components/mdx/gist";
import { 
  InfoIcon, 
  SuccessIcon, 
  WarningIcon, 
  ErrorIcon, 
  TipIcon, 
  NoteIcon
} from "./components/icons";

/**
 * MDX Components available in all MDX files
 * 
 * Code Block Features (via rehype-pretty-code):
 * - Copy button: Automatically added to all code blocks (hover to show)
 * - Line numbers: Add `showLineNumbers` to the code block meta string
 *   Example: ```typescript showLineNumbers
 * - Line highlighting: Add line ranges to highlight specific lines
 *   Example: ```typescript {2-4} (highlights lines 2-4)
 *   Example: ```typescript {1,3,5} (highlights lines 1, 3, and 5)
 * - Combined: ```typescript showLineNumbers {2-4}
 * 
 * Custom Components:
 * - CTACard: Call-to-action card component
 * - Figure: Enhanced image component with caption support
 * - Alert: Info/warning/error/success alert boxes
 *   Example: <Alert type="info">Your message</Alert>
 *   Example with custom icon: <Alert type="warning" icon={TipIcon}>Pro tip here</Alert>
 * - MermaidDiagram: Render Mermaid diagrams with theme support
 * - Pre: Enhanced code block with copy button functionality
 * - GistEmbed: Embed GitHub Gists with syntax highlighting
 *   Example: <GistEmbed gist="username/gistId" />
 *   Example: <GistEmbed gist="username/gistId" file="specific-file.js" />
 * 
 * Available Icons (can be used to override Alert icons):
 * - InfoIcon, SuccessIcon, WarningIcon, ErrorIcon, TipIcon, NoteIcon
 * - And many more UI icons...
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CTACard,
    Figure,
    Alert,
    MermaidDiagram,
    pre: Pre,
    GistEmbed,
    // Icons available for use in MDX
    InfoIcon,
    SuccessIcon,
    WarningIcon,
    ErrorIcon,
    TipIcon,
    NoteIcon,
  };
}
