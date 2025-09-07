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

export const sheetArtifact = {
  kind: 'sheet',
  content: (props: ArtifactContentProps) => {
    return (
      <div>
        <h3>{props.title} (Sheet Artifact)</h3>
        <p>{props.content}</p>
        {/* This would typically be a more complex component for rendering spreadsheet data */}
      </div>
    );
  },
};
