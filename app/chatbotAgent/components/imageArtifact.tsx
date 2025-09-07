import { type FC } from 'react';

interface ArtifactContentProps {
  title: string;
  content: string;
  mode: 'edit' | 'diff';
  status: 'awaiting_message' | 'in_progress' | 'done';
  currentVersionIndex: number;
  suggestions: any[];
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  isInline: boolean;
  isCurrentVersion: boolean;
  getDocumentContentById: (index: number) => string;
  isLoading: boolean;
  metadata: any;
  setMetadata: (metadata: any) => void;
}

export const imageArtifact = {
  kind: 'image',
  content: (props: ArtifactContentProps) => {
    return (
      <div>
        <h3>{props.title} (Image Artifact)</h3>
        <img src={props.content} alt={props.title} />
        {/* Add more rendering logic based on props */}
      </div>
    );
  },
};
