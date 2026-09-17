import { DesignElement, Designs } from '@minddrop/designs-next';

/**
 * Applies an element transform to each of a database's designs.
 * Designs whose elements the transform returned as they were are
 * not updated.
 *
 * @param databaseId - The ID of the database owning the designs.
 * @param transform - Returns the design's new elements.
 */
export async function updateDatabaseDesignsElements(
  databaseId: string,
  transform: (elements: DesignElement[]) => DesignElement[],
): Promise<void> {
  // Get the database's designs
  const designs = Designs.getByOwner(databaseId);

  // Transform each of them
  await Promise.all(
    designs.map(async (design) => {
      // Transform the design's elements
      const elements = transform(design.elements);

      // Check if the transform changed anything. If not, leave the
      // design as it is.
      if (elements === design.elements) {
        return;
      }

      // Update the design with the transformed elements
      await Designs.update(design.id, { elements });
    }),
  );
}
