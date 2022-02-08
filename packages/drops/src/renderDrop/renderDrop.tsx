import React from 'react';
import { getDropTypeConfig } from '../getDropTypeConfig';
import { Drop } from '../types';

/**
 * Renders a drop using the appropriate component.
 *
 * @param drop The drop to render.
 * @returns The rendered drop element.
 */
export function renderDrop(drop: Drop): React.ReactElement {
  const dropConfig = getDropTypeConfig(drop.type);
  const Component = dropConfig.component;

  return <Component {...drop} />;
}
