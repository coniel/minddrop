import React from 'react';
import { Drops, Drop } from '@minddrop/drops';
import { ResourceReference } from '@minddrop/resources';

/**
 * Renders a drop using the appropriate component.
 *
 * @param drop The drop to render.
 * @param parent The `DropParentReference` of the parent inside which the drop is being rendered.
 * @returns The rendered drop element.
 */
export function renderDrop(
  drop: Drop,
  parent?: ResourceReference,
): React.ReactElement {
  const dropConfig = Drops.getTypeConfig(drop.type);
  const Component = dropConfig.component;

  return <Component key={drop.id} currentParent={parent} {...drop} />;
}
