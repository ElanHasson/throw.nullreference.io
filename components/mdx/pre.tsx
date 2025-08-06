import { CopyButton } from "../copy-button";
import React from "react";

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: React.ReactNode;
  "data-language"?: string;
  "data-theme"?: string;
  raw?: string;
}

export function Pre({ children, raw, ...props }: PreProps) {
  // Extract text content for copy button
  const getText = () => {
    if (raw) return raw;
    
    // Fallback: extract text from children
    const extractText = (node: React.ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return String(node);
      if (!node) return '';
      if (React.isValidElement(node) && node.props?.children) {
        if (Array.isArray(node.props.children)) {
          return node.props.children.map(extractText).join('');
        }
        return extractText(node.props.children);
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join('');
      }
      return '';
    };
    
    return extractText(children);
  };

  return (
    <div className="group relative">
      <pre {...props}>
        {children}
      </pre>
      <CopyButton text={getText()} />
    </div>
  );
}