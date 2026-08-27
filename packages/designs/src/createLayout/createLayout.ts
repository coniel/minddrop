import { InvalidParameterError } from '@minddrop/utils';
import { DesignTypeLayoutTypes } from '../constants';
import { getDesign } from '../getDesign';
import { Layout, LayoutFrame, LayoutType } from '../types';
import { updateDesign } from '../updateDesign';
import { buildLayout } from '../utils';

export interface CreateLayoutOptions {
  /**
   * The layout type. Must be valid for the parent design's type.
   */
  type: LayoutType;

  /**
   * The layout name. Defaults to the localized type name.
   */
  name?: string;

  /**
   * The frame position on the design canvas. Defaults to the origin.
   */
  position?: Pick<LayoutFrame, 'x' | 'y'>;
}

/**
 * Creates a new layout inside the specified design.
 *
 * @param designId - The ID of the parent design.
 * @param options - The layout type, name and canvas position.
 * @returns The new layout.
 *
 * @throws {DesignNotFoundError} If the parent design does not exist.
 * @throws {InvalidParameterError} If the layout type is not valid for the design type.
 */
export async function createLayout(
  designId: string,
  options: CreateLayoutOptions,
): Promise<Layout> {
  // Get the parent design
  const design = getDesign(designId);

  // Ensure the layout type is valid for the design type
  if (!DesignTypeLayoutTypes[design.type].includes(options.type)) {
    throw new InvalidParameterError(
      `Cannot create a ${options.type} layout in a ${design.type} design.`,
    );
  }

  // Build the new layout with an empty root tree
  const layout = buildLayout(options.type, {
    name: options.name,
    position: options.position,
  });

  // Append the layout to the parent design and persist
  await updateDesign(design.id, { layouts: [...design.layouts, layout] });

  return layout;
}
