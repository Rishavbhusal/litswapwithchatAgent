
import { createDocumentHandler } from './factory';

export const imageDocumentHandler = createDocumentHandler({
  kind: 'image',
  onCreateDocument: async () => {
    return '';
  },
  onUpdateDocument: async () => {
    return '';
  },
});
