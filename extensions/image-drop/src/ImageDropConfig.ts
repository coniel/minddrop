import { DropTypeConfig } from '@minddrop/drops';
import { ImageDropData } from './types';
import { ImageDropComponent } from './ImageDropComponent';

export const ImageDropConfig: DropTypeConfig<ImageDropData> = {
  type: 'image',
  component: ImageDropComponent,
  name: 'Image',
  description: 'An image drop',
  fileTypes: [
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'image/bmp',
    'image/x-icon',
  ],
  dataSchema: {
    file: {
      type: 'resource-id',
      resource: 'files:file-reference',
      required: false,
    },
  },
  initializeData: () => ({}),
};
