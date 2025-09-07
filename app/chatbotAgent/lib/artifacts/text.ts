
import { createDocumentHandler } from './factory';

export const textDocumentHandler = createDocumentHandler({
  kind: 'text',
  onCreateDocument: async () => {
    return '';
  },
  onUpdateDocument: async () => {
    return '';
  },
});
