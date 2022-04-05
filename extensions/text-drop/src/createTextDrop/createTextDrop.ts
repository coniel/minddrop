import { Core, DataInsert } from '@minddrop/core';
import { RichTextDocuments, RichTextElements } from '@minddrop/rich-text';
import { CreateTextDropData } from '../types';

/**
 * Generates the data to create a new text drop.
 *
 * @param core A MindDrop core instance.
 * @param dataInsert Inserted data.
 * @returns The data to create a text drop.
 */
export function createTextDrop(
  core: Core,
  dataInsert?: DataInsert,
): CreateTextDropData {
  // The IDs of the drop document's elements
  const children: string[] = [];

  if (dataInsert && dataInsert.types.includes('text/plain')) {
    // Set the inserted plain text as the content
    children.push(
      RichTextElements.createOfType(core, 'paragraph', dataInsert).id,
    );
  } else {
    // Create empty 'heading-1' and 'paragraph' elements as
    // the drop's content.
    children.push(RichTextElements.createOfType(core, 'heading-1').id);
    children.push(RichTextElements.createOfType(core, 'paragraph').id);
  }

  // Create the drop's rich text document
  const document = RichTextDocuments.create(core, { children });

  // Create tge drop data
  const drop: CreateTextDropData = {
    type: 'text',
    richTextDocument: document.id,
  };

  return drop;
}
