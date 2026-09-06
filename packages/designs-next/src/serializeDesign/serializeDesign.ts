import { Design, StoredDesign } from '../types';

/**
 * Serializes a design into its stored form, stripping the owner
 * which owner-persisted designs derive at load time.
 *
 * @param design - The design to serialize.
 * @returns The stored form of the design.
 */
export function serializeDesign(design: Design): StoredDesign {
  // Strip the owner, it is derived at load time
  const { owner: _owner, ...storedDesign } = design;

  return storedDesign;
}
