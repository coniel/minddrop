import {
  BlockquoteFrame,
  ListItemFrame,
  resolveInnermostListItem,
} from '@minddrop/ast';
import { uuid } from '@minddrop/utils';
import { pushFrame } from './pushFrame';
import { setTaskItemState } from './setTaskItemState';
import { BlockShortcut } from './types';

// The bullet characters CommonMark accepts, each of which is preserved as
// authored
const BulletMarkers = ['-', '*', '+'];

// The bullet given to an item created by a shortcut which types no marker of
// its own, being the checkbox shortcuts
const DefaultBulletMarker = '-';

// The delimiters CommonMark accepts after an ordered item's number
const OrderedMarkers = ['.', ')'];

// The checkbox spellings a task item can be typed with. An empty box is
// written back as '[ ]' however it was typed, since '[]' is a MindDrop
// convenience rather than valid GFM.
const CheckboxSyntaxes: Record<string, string> = {
  '[] ': ' ',
  '[ ] ': ' ',
  '[x] ': 'x',
  '[X] ': 'X',
};

/**
 * The shortcuts which draw a container around the block they are typed in.
 *
 * These change a block's containers rather than its type: a quoted paragraph
 * is still a paragraph.
 */
export const FrameShortcuts: BlockShortcut[] = [
  ...BulletMarkers.map((marker) => buildListItemShortcut(marker, false)),
  ...OrderedMarkers.map((marker) => buildListItemShortcut(marker, true)),
  {
    trigger: '> ',
    apply: (editor, path) => {
      const frame: BlockquoteFrame = {
        id: uuid(),
        kind: 'blockquote',
        syntax: '> ',
      };

      pushFrame(editor, path, frame);
    },
  },
  ...Object.keys(CheckboxSyntaxes).map(buildCheckboxShortcut),
];

/**
 * Builds the shortcut which turns a block into a list item.
 *
 * @param marker - The marker as typed.
 * @param ordered - Whether the marker starts an ordered list.
 * @returns The shortcut.
 */
function buildListItemShortcut(
  marker: string,
  ordered: boolean,
): BlockShortcut {
  return {
    // An ordered list is started by a number, of which only the first is
    // honoured, so the shortcut is the list's own start
    trigger: ordered ? `1${marker} ` : `${marker} `,
    apply: (editor, path) => {
      const frame: ListItemFrame = {
        id: uuid(),
        kind: 'list-item',
        ordered,
        marker,
      };

      pushFrame(editor, path, frame);
    },
  };
}

/**
 * Builds the shortcut which gives a block a checkbox.
 *
 * @param trigger - The checkbox as typed.
 * @returns The shortcut.
 */
function buildCheckboxShortcut(trigger: string): BlockShortcut {
  const syntax = CheckboxSyntaxes[trigger];
  const checked = syntax !== ' ';

  return {
    trigger,
    apply: (editor, path, element) => {
      const item = resolveInnermostListItem(element.ancestry);

      // Inside a list item the checkbox gives that item its task state
      if (item) {
        setTaskItemState(editor, item.id, checked, syntax);

        return;
      }

      // Anywhere else it makes the block a task item of its own, a task item
      // being a list item which carries a checked state
      const frame: ListItemFrame = {
        id: uuid(),
        kind: 'list-item',
        ordered: false,
        marker: DefaultBulletMarker,
        checked,
        checkedSyntax: syntax,
      };

      pushFrame(editor, path, frame);
    },
  };
}
