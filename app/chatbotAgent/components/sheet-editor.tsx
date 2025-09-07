'use client';

import React, { memo } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '../lib/utils';

type SheetEditorProps = {
  content: string;
  saveContent: (content: string, isCurrentVersion: boolean) => void;
  status: string;
  isCurrentVersion: boolean;
  currentVersionIndex: number;
};

const PureSpreadsheetEditor = ({
  content,
  saveContent,
  status,
  isCurrentVersion,
}: SheetEditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    saveContent(event.target.value, true);
  };

  return (
    <textarea
      className={cn(
        "w-full h-full p-4 font-mono text-sm",
        resolvedTheme === 'dark' ? 'bg-zinc-950 text-zinc-50' : 'bg-white text-zinc-950'
      )}
      value={content}
      onChange={handleChange}
      placeholder="Enter spreadsheet data here..."
    />
  );
};

function areEqual(prevProps: SheetEditorProps, nextProps: SheetEditorProps) {
  return (
    prevProps.currentVersionIndex === nextProps.currentVersionIndex &&
    prevProps.isCurrentVersion === nextProps.isCurrentVersion &&
    !(prevProps.status === 'streaming' && nextProps.status === 'streaming') &&
    prevProps.content === nextProps.content &&
    prevProps.saveContent === nextProps.saveContent
  );
}

export const SpreadsheetEditor = memo(PureSpreadsheetEditor, areEqual);