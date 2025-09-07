
import { createDocumentHandler } from './factory';

export const sheetDocumentHandler = createDocumentHandler({
  kind: 'sheet',
  onCreateDocument: async () => {
    return '';
  },
  onUpdateDocument: async () => {
    return '';
  },
});
