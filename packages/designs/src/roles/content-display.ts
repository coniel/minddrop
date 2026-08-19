import { DesignRoleConfig } from '../types';

/**
 * A read-only rendering of the entry's content document, for
 * contexts where inline editing is not wanted (e.g. previews).
 */
export const ContentDisplayRole: DesignRoleConfig = {
  id: 'content-display',
  elementType: 'formatted-text',
  label: 'designs.roles.content-display.label',
  icon: 'book-open-text',
  lockedStyle: {
    color: 'regular',
  },
  contextStyles: {
    card: { fontSize: 'sm', lineHeight: 'snug' },
    page: { fontSize: 'md', lineHeight: 'relaxed', maxWidth: 'content' },
    space: { fontSize: 'md', lineHeight: 'relaxed', maxWidth: 'content' },
  },
  editableStyles: [
    'textAlign',
    'truncate',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
  ],
  bindsPropertyTypes: ['formatted-text'],
  context: { layoutTypes: ['card', 'page', 'space'] },
};
