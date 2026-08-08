import { Path, Editor as SlateEditor, Element as SlateElement } from 'slate';
import { Element } from '@minddrop/ast';
import { EditorBlockElementConfigsStore } from '../BlockElementTypeConfigsStore';
import { Transforms } from '../Transforms';
import { Editor } from '../types';

/**
 * Converts the given top level blocks to another block type.
 *
 * @param editor An editor instance.
 * @param paths The paths of the blocks to convert.
 * @param type The block type to convert them to.
 * @param data Element data applied over the converted blocks.
 */
export function turnBlocksInto(
  editor: Editor,
  paths: Path[],
  type: string,
  data?: Partial<Element>,
): void {
  SlateEditor.withoutNormalizing(editor, () => {
    paths.forEach((path) => {
      const block = editor.children[path[0]];

      // The block may no longer be in the document
      if (!SlateElement.isElement(block)) {
        return;
      }

      const config = EditorBlockElementConfigsStore.get(type);

      // Nothing to convert to
      if (!config) {
        return;
      }

      // Types which define their own conversion decide what carries
      // over. The rest start from their own initial data rather than
      // from the block's, which belongs to the type it is leaving.
      const converted = config.convert
        ? config.convert(block)
        : { ...(config.initialize ? config.initialize() : {}), type };

      // Data belonging to the previous type is dropped, the block's
      // ID aside: a block which changes type is still the same block.
      Transforms.unsetNodes(
        editor,
        Object.keys(block).filter((key) => key !== 'id' && key !== 'type'),
        { at: path },
      );

      Transforms.setNodes<Element>(
        editor,
        { ...converted, ...data },
        { at: path },
      );
    });
  });
}
