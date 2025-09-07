import { textDocumentHandler } from './text';
import { codeDocumentHandler } from './code';
import { imageDocumentHandler } from './image';
import { sheetDocumentHandler } from './sheet';
import { DocumentHandler } from './factory';

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  codeDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];

export const artifactKinds = ['text', 'code', 'image', 'sheet'] as const;