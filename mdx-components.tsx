import type { MDXComponents } from "mdx/types";
import { CTACard } from "./app/blog/_components/cta-card";
import { Figure } from "./components/mdx/figure";
import { Alert } from "./components/mdx/alert";
import { MermaidDiagram } from "./components/mdx/mermaid";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CTACard,
    Figure,
    Alert,
    MermaidDiagram,
  };
}
