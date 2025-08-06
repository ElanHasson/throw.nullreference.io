"use client";

import { useEffect, useState } from 'react';

interface GistEmbedProps {
  gist: `${string}/${string}`; // Format: "username/gistId"
  file?: string; // Optional: specific file from the gist
}

interface GistFile {
  filename: string;
  language: string;
  raw_url: string;
  content: string;
}

interface GistData {
  files: Record<string, GistFile>;
  description: string;
  owner: {
    login: string;
  };
  html_url: string;
}

export function GistEmbed({ gist, file }: GistEmbedProps) {
  const [gistData, setGistData] = useState<GistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGist = async () => {
      try {
        const gistId = gist.split('/')[1];
        const response = await fetch(`https://api.github.com/gists/${gistId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch gist: ${response.status}`);
        }
        
        const data = await response.json();
        setGistData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gist');
      } finally {
        setLoading(false);
      }
    };

    fetchGist();
  }, [gist]);

  if (loading) {
    return (
      <div className="my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !gistData) {
    return (
      <div className="my-6 rounded-lg overflow-hidden border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4">
        <div className="text-red-600 dark:text-red-400">
          {error || 'Failed to load gist'}
        </div>
        <a 
          href={`https://gist.github.com/${gist}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
        >
          View on GitHub
        </a>
      </div>
    );
  }

  const filesToDisplay = file 
    ? Object.entries(gistData.files).filter(([filename]) => filename === file)
    : Object.entries(gistData.files);

  return (
    <div className="my-6 space-y-2">
      {filesToDisplay.map(([filename, fileData]) => (
        <div 
          key={filename}
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {filename}
            </span>
            <a 
              href={gistData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View on GitHub
            </a>
          </div>
          <pre className="!my-0 !border-0 !rounded-none overflow-x-auto p-4 bg-gray-50 dark:bg-gray-950">
            <code className="text-sm">
              {fileData.content}
            </code>
          </pre>
        </div>
      ))}
    </div>
  );
}