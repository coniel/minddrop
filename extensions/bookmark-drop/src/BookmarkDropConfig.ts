import { DropTypeConfig } from '@minddrop/drops';
import { BookmarkDropData } from './types';
import { BookmarkDropComponent } from './BookmarkDropComponent';
import { initializeBookmarkDropData } from './initializeBookmarkDropData';

export const BookmarkDropConfig: DropTypeConfig<BookmarkDropData> = {
  type: 'bookmark',
  component: BookmarkDropComponent,
  name: 'Bookmark',
  description: 'A rich text drop',
  domains: ['*'],
  initializeData: initializeBookmarkDropData,
  dataSchema: {
    url: {
      type: 'string',
      required: true,
      allowEmpty: true,
    },
    hasPreview: {
      type: 'boolean',
      required: true,
    },
    title: {
      type: 'string',
      required: false,
    },
    description: {
      type: 'string',
      required: false,
    },
    image: {
      type: 'resource-id',
      resource: 'files:file-reference',
      required: false,
    },
  },
};
