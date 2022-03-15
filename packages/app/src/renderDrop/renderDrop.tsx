import React from 'react';
import { Drops, Drop, DropParentReference } from '@minddrop/drops';

/**
 * Renders a drop using the appropriate component.
 *
 * @param drop The drop to render.
 * @param parent The `DropParentReference` of the parent inside which the drop is being rendered.
 * @returns The rendered drop element.
 */
export function renderDrop(
  drop: Drop,
  parent?: DropParentReference,
): React.ReactElement {
  const dropConfig = Drops.getConfig(drop.type);
  const Component = dropConfig.component;

  return <Component key={drop.id} parent={parent} {...drop} />;
}
