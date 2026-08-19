import { DesignRoleConfig } from '../types';

/**
 * The entry's content document, rendered as an editable editor.
 * Reading length on pages, compact on cards (e.g. a card that is
 * just a short note).
 */
export const ContentRole: DesignRoleConfig = {
  id: 'content',
  elementType: 'editor',
  label: 'designs.roles.content.label',
  icon: 'file-edit',
  lockedStyle: {
    color: 'regular',
  },
  contextStyles: {
    card: { fontSize: 'sm', lineHeight: 'snug' },
    page: { fontSize: 'md', lineHeight: 'relaxed', maxWidth: 'content' },
    space: { fontSize: 'md', lineHeight: 'relaxed', maxWidth: 'content' },
  },
  editableStyles: [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
  ],
  bindsPropertyTypes: ['formatted-text'],
  context: { layoutTypes: ['card', 'page', 'space'] },
};
