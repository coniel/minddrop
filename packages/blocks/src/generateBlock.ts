import { v4 as uuid } from 'uuid';
import { BlockTypesStore } from './BlockTypesStore';
import { classifyFileBlock } from './classifyFileBlock';
import { classifyLinkBlock } from './classifyLinkBlock';
import { classifyTextBlock } from './classifyTextBlock';
import { Block, BlockData } from './types';

export function generateBlock(
  type: string,
  data: BlockData = {},
  variant?: string,
): Block {
  // Create a basic text block as a fallback
  let block: Block = {
    ...data,
    type,
    id: uuid(),
    created: new Date(),
    lastModified: new Date(),
  };

  // Get the block type configuration
  const blockType = BlockTypesStore.get(type);

  // Apply block type defaults if available
  if (blockType) {
    block = {
      ...block,
      ...(blockType.initialProperties || {}),
      variant: blockType.defaultVariant,
    };
  }

  // Apply the specified variant if provided
  if (variant) {
    block.variant = variant;
  }

  return block;
}

/**
 * Generates a new block from a string using registered text block
 * classifiers to determine the block type.
 *
 * Falls back to a basic text block if no classifier matches.
 *
 * @param text - The text from which to generate a block.
 * @returns A new block.
 */
export function generateTextBlock(text = ''): Block {
  const block = generateBlock('text', { text });

  const properties = classifyTextBlock(text) || block;

  return { ...block, ...properties };
}

/**
 * Generates a new block from a file using registered file block
 * classifiers to determine the block type.
 *
 * Falls back to a basic file block if no classifier matches.
 *
 * @param file - The file from which to generate a block.
 * @param filename - The name of the file on disk (may differ from the file name).
 * @returns A new block.
 */
export function generateFileBlock(file: File, filename: string): Block {
  const block = generateBlock('file', { file: filename });

  const properties = classifyFileBlock(file) || block;

  return { ...block, ...properties };
}

/**
 * Generates a new block from a URL using registered link block
 * classifiers to determine the block type.
 *
 * Falls back to a basic link block if no classifier matches.
 *
 * @param url - The URL from which to generate a block.
 * @returns A new block.
 */
export function generateLinkBlock(url: string): Block {
  const block: Block = generateBlock('link', { url });

  const properties = classifyLinkBlock(url) || block;

  return { ...block, ...properties };
}
