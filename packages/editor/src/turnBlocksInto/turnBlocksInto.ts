import { Path, Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Element, Frame } from '@minddrop/ast';
import { getEditorElementConfig } from '../EditorElementConfigs';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { opensInnermostFrame, resolveMenuItemAncestry } from '../utils';

// The data a block keeps when it changes type, being what belongs to the
// block itself rather than to the type it is leaving
const CarriedKeys = ['id', 'type', 'ancestry'];

/**
 * Converts the given top level blocks to another block type.
 *
 * The blocks stay in the containers around them, giving up only the list
 * item they were, which is what the type they are converted to replaces.
 *
 * @param editor An editor instance.
 * @param paths The paths of the blocks to convert.
 * @param type The block type to convert them to.
 * @param data Element data applied over the converted blocks.
 * @param frame Builds the container the blocks are drawn inside, for types which nest.
 */
export function turnBlocksInto(
  editor: Editor,
  paths: Path[],
  type: string,
  data?: Partial<Element>,
  frame?: () => Frame,
): void {
  SlateEditor.withoutNormalizing(editor, () => {
    paths.forEach((path) => {
      const block = editor.children[path[0]];

      // The block may no longer be in the document
      if (!SlateElement.isElement(block)) {
        return;
      }

      const config = getEditorElementConfig(type);

      // Nothing to convert to
      if (!config) {
        return;
      }

      // Types which define their own conversion decide what carries
      // over. The rest keep only the new type, since the block's data
      // belongs to the type it is leaving.
      const converted = config.convert ? config.convert(block) : { type };

      // Resolved before the block changes, since it is read from where the
      // block sits among the blocks around it
      const ancestry = resolveMenuItemAncestry(
        (block as Element).ancestry || [],
        opensInnermostFrame(editor.children as Element[], path[0]),
        frame?.(),
      );

      // Data belonging to the previous type is dropped. The block's ID and
      // its containers are not: a block which changes type is still the same
      // block, and it is still where it was.
      Transforms.unsetNodes(
        editor,
        Object.keys(block).filter((key) => !CarriedKeys.includes(key)),
        { at: path },
      );

      Transforms.setNodes<Element>(
        editor,
        { ...converted, ...data, ancestry },
        { at: path },
      );
    });
  });
}
