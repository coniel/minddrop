import { ContentColor } from '@minddrop/core';
import { generateId } from '@minddrop/utils';
import { Tag } from '../types';

/**
 * Generates a new tag.
 *
 * @param label The tag label.
 * @param color The tag color.
 * @returns A new tag.
 */
export function generateTag(label: string, color: ContentColor = 'blue'): Tag {
  return {
    label,
    color,
    id: generateId(),
  };
}
