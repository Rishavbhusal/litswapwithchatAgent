
import { createDocumentHandler } from './factory';

export const codeDocumentHandler = createDocumentHandler({
  kind: 'code',
  onCreateDocument: async () => {
    return '';
  },
  onUpdateDocument: async () => {
    return '';
  },
});
