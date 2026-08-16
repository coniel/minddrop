import { uuid } from '@minddrop/utils';
import { BlockMenuItem } from './utils/getBlockMenuItems';

/**
 * The menu entries which draw a container around a block rather than
 * changing its type. A quoted paragraph is still a paragraph, so these carry
 * the default block type and a container to put it in.
 */
export const FrameMenuItems: BlockMenuItem[] = [
  {
    type: 'paragraph',
    label: 'editor.elements.list-item.name',
    keywords: 'editor.elements.list-item.keywords',
    icon: 'list',
    frame: () => ({
      id: uuid(),
      kind: 'list-item',
      ordered: false,
      marker: '-',
    }),
  },
  {
    type: 'paragraph',
    label: 'editor.elements.ordered-list-item.name',
    keywords: 'editor.elements.ordered-list-item.keywords',
    icon: 'list-ordered',
    frame: () => ({
      id: uuid(),
      kind: 'list-item',
      ordered: true,
      marker: '.',
    }),
  },
  {
    type: 'paragraph',
    label: 'editor.elements.task-list-item.name',
    keywords: 'editor.elements.task-list-item.keywords',
    icon: 'list-todo',
    // A task item is a list item carrying a checked state, which starts
    // unticked
    frame: () => ({
      id: uuid(),
      kind: 'list-item',
      ordered: false,
      marker: '-',
      checked: false,
    }),
  },
  {
    type: 'paragraph',
    label: 'editor.elements.blockquote.name',
    keywords: 'editor.elements.blockquote.keywords',
    icon: 'quote',
    frame: () => ({ id: uuid(), kind: 'blockquote', syntax: '> ' }),
  },
];
