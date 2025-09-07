import { type FC } from 'react';

interface ArtifactContentProps {
  title: string;
  content: string;
  mode: 'edit' | 'diff';
  status: 'awaiting_message' | 'in_progress' | 'done'; // Adjust based on actual UseChatHelpers status
  currentVersionIndex: number;
  suggestions: any[]; // Define a proper type if known
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  isInline: boolean;
  isCurrentVersion: boolean;
  getDocumentContentById: (index: number) => string;
  isLoading: boolean;
  metadata: any; // Define a proper type if known
  setMetadata: (metadata: any) => void; // Define a proper type if known
}

export const textArtifact = {
  kind: 'text',
  content: (props: ArtifactContentProps) => {
    return (
      <div>
        <h3>{props.title} (Text Artifact)</h3>
        <p>{props.content}</p>
        {/* Add more rendering logic based on props */}
      </div>
    );
  },
  // initialize: ({ documentId, setMetadata }) => { /* optional initialization logic */ }
};
