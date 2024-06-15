import { Editor as SlateEditor, Path, Text, Transforms, Range } from 'slate';
import { BlockElement, Element } from '@minddrop/ast';
import {
  Editor,
  InlineShortcut,
  InlineShortcutAction,
  InlineShortcutWrapTrigger,
} from '../types';

type StringShortcutTuple = [string, InlineShortcutAction];
type WrapShortcutTuple = [InlineShortcutWrapTrigger, InlineShortcutAction];
type ShortcutTuple = StringShortcutTuple | WrapShortcutTuple;

function isStringShortcut(
  shortcut: ShortcutTuple,
): shortcut is StringShortcutTuple {
  return typeof shortcut[0] === 'string';
}

function isWrapShortcut(
  shortcut: ShortcutTuple,
): shortcut is WrapShortcutTuple {
  return typeof shortcut[0] !== 'string';
}

function getShortcutTriggerChars(shortcut: InlineShortcut): string[] {
  // Loop through the shortcut's triggers, returning the
  // last character of the trigger/end string.
  return shortcut.triggers.map((trigger) =>
    typeof trigger === 'string'
      ? trigger.slice(-1)[0]
      : trigger.end.slice(-1)[0],
  );
}

/**
 * Adds support for inline shortcuts.
 *
 * @param editor - An editor instance.
 * @param shortcuts - Inline shortcuts to apply to the editor.
 * @returns The editor instance with the plugin behaviour.
 */
export function withInlineShortcuts(
  editor: Editor,
  shortcuts: InlineShortcut[],
): Editor {
  const { insertText } = editor;

  // List all trigger characters (last character of a shortcut/end string)
  const triggerChars = shortcuts.reduce<string[]>(
    (chars, shortcut) => [...chars, ...getShortcutTriggerChars(shortcut)],
    [],
  );

  // Create an array of [trigger, action] tuples for every trigger
  // of every shortcut.
  const triggerActions = shortcuts.reduce<ShortcutTuple[]>(
    (value, shortcut) => [
      ...value,
      ...shortcut.triggers.map<ShortcutTuple>(
        (trigger) => [trigger, shortcut.action] as ShortcutTuple,
      ),
    ],
    [],
  );

  // Create an array of [trigger, action] tuples for every start/end
  // triggered shortcut, sorted by descending start trigger length.
  const startEndTriggerActions: WrapShortcutTuple[] = triggerActions
    .filter(isWrapShortcut)
    .sort(([a], [b]) => b.start.length - a.start.length);

  // Create an array of [trigger, action] tuples for every string
  // triggered shortcut, sorted by descending trigger length.
  const stringTriggerActions = triggerActions
    .filter(isStringShortcut)
    .sort(([a], [b]) => b.length - a.length);

  // eslint-disable-next-line no-param-reassign
  editor.insertText = (insertedText) => {
    // Only trigger on single character input which matches
    // the final character of a shortcut/end string
    if (insertedText.length > 1 || !triggerChars.includes(insertedText)) {
      // If inserted text was not a shortcut trigger, insert
      // the text as normal.
      insertText(insertedText);

      return;
    }

    let matched = false;
    const { focus } = editor.selection as Range;
    // Get the parent block in which the shortcut was triggered
    const parentBlock = SlateEditor.above(editor, {
      match: (n) => SlateEditor.isBlock(editor, n as Element),
      at: focus.path,
    }) as [BlockElement, Path];
    // The parent block's path
    const parentBlockPath = parentBlock ? parentBlock[1] : [];
    // The start location of the parent block
    const start = SlateEditor.start(editor, parentBlockPath);
    // The range of the parent blocks text up to the text
    // insertion point.
    const range = { anchor: start, focus };
    // The parent block's text up to the insertion pont
    let text = SlateEditor.string(editor, range);
    // Add the inserted text to the end of the current text
    text = `${text}${insertedText}`;
    // The length of the longest matched start trigger
    let minStartTriggerLength = 1;

    startEndTriggerActions.every(([trigger, action]) => {
      // Get the text leading up to but excluding the trigger end
      const leadText = text.slice(0, -trigger.end.length);

      // Ensure that the text contains the start trigger at least
      // one character before the end trigger.
      if (
        !leadText.includes(trigger.start) ||
        leadText.endsWith(trigger.start)
      ) {
        // Does not contain (or it ends with) the start trigger
        // move on to next one.
        return true;
      }

      // Ensure that the start trigger match is not a partial match
      // of a previously matched start trigger.
      if (trigger.start.length < minStartTriggerLength) {
        // Stop here to prevent a shorter trigger pair (e.g. */*)
        // from prematurely closing a longer pair that uses the
        // same characters (e.g. **/**).
        return true;
      }

      // Set the new minimum start trigger length
      minStartTriggerLength = trigger.start.length;

      // Check that the end of the text is the end trigger
      if (!text.endsWith(trigger.end)) {
        // Does not end with end trigger, move on to next one
        return true;
      }

      // Shortcut has been matched
      matched = true;

      // If the end trigger is multiple characters long,
      // remove the previously inputed characters.
      if (trigger.end.length > 1) {
        // Delete the inputed part of the end trigger
        Transforms.delete(editor, {
          at: {
            anchor: {
              path: focus.path,
              // +1 because the last character was not inserted
              offset: focus.offset - trigger.end.length + 1,
            },
            focus,
          },
        });
      }

      // The index of the leaf containing the start trigger
      let startTriggerLeafIndex = 0;
      // The index of the first leaf wrapped by the triggers.
      // This can be different to the start trigger leaf if
      // the start trigger is placed on the trailing edge of
      // a leaf.
      let firstAffectedLeafIndex = 0;
      // The offset of the start of the wrapped text
      let startOffset = 0;

      // Loop through all the leaves up to and including
      // the one into which the text is being inserted.
      parentBlock[0].children.forEach((child, index) => {
        if (!Text.isText(child)) {
          return;
        }

        // Ignore leaves which are after the end trigger
        if (index <= focus.path.slice(-1)[0]) {
          if (child.text.includes(trigger.start)) {
            // We want the closest match, so overriding an
            // existing value is fine.
            startTriggerLeafIndex = index;
            firstAffectedLeafIndex = index;
            startOffset = child.text.lastIndexOf(trigger.start);

            // If the mark is at the trailing edge of the node,
            // the first affected leaf will be the next leaf.
            if (child.text.endsWith(trigger.end)) {
              firstAffectedLeafIndex += 1;
              startOffset = 0;
            }
          }
        }
      });

      // The start trigger's offset within the leaf's text
      const startTriggerOffset = (
        parentBlock[0].children[startTriggerLeafIndex] as Text
      ).text.lastIndexOf(trigger.start);
      // The path of the leaf containing the start trigger
      const startTriggerPath = [...parentBlockPath, startTriggerLeafIndex];

      // Delete the start trigger
      Transforms.delete(editor, {
        distance: trigger.start.length,
        unit: 'character',
        at: {
          path: startTriggerPath,
          offset: startTriggerOffset,
        },
      });

      // Select the text which was wrapped by the shortcut triggers
      Transforms.setSelection(editor, {
        anchor: {
          path: [...parentBlockPath, firstAffectedLeafIndex],
          offset: startOffset,
        },
        focus:
          focus.offset === trigger.end.length - 1
            ? // If the end trigger was at the leading edge of a node,
              // set focus to the trailing edge of the previous node.
              SlateEditor.end(editor, Path.previous(focus.path))
            : // Otherwise set the focus to insertion point
              {
                path: focus.path,
                offset:
                  focus.offset -
                  trigger.end.length +
                  1 -
                  (Path.equals(focus.path, startTriggerPath)
                    ? trigger.start.length
                    : 0),
              },
      });

      // Fire the action
      action(editor);

      // Shortcut has been triggered, stop here
      return false;
    });

    if (matched) {
      // If the shortcut was triggered above, stop here
      return;
    }

    // String shortcuts
    stringTriggerActions.every(([trigger, action]) => {
      // Check that the end of the text is the trigger text
      if (text.endsWith(trigger)) {
        // If the shortcut trigger is multiple characters
        // long, remove the previously inputed characters.
        if (trigger.length > 1) {
          matched = true;

          // Select the inputed part of the trigger string
          Transforms.setSelection(editor, {
            anchor: {
              path: focus.path,
              offset: focus.offset - trigger.length + 1,
            },
            focus,
          });

          // Delete the selected text
          Transforms.delete(editor);
        }

        // Fire the action.
        action(editor);

        // Stop here
        return false;
      }

      return true;
    });

    if (!matched) {
      // If none of the shortcuts were a match, insert the
      // text as usual.
      insertText(insertedText);
    }
  };

  return editor;
}
