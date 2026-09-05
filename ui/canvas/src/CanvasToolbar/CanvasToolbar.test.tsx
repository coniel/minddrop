import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render } from '@minddrop/test-utils';
import { CanvasProvider } from '../CanvasProvider';
import { CanvasToolbar, CanvasToolbarProps } from './CanvasToolbar';

// Renders the toolbar within a canvas provider and opens its
// settings menu
const renderToolbar = (props: Partial<CanvasToolbarProps> = {}) => {
  const { container } = render(
    <CanvasProvider>
      <CanvasToolbar {...props} />
    </CanvasProvider>,
  );

  const settingsButton = container.querySelector(
    '.ui-canvas-toolbar-settings button',
  ) as HTMLElement;

  fireEvent.click(settingsButton);

  return container;
};

describe('<CanvasToolbar />', () => {
  afterEach(cleanup);

  it('renders the zoom and settings toolbars', () => {
    const container = renderToolbar();

    expect(container.querySelector('.ui-canvas-toolbar-zoom')).not.toBeNull();
    expect(
      container.querySelector('.ui-canvas-toolbar-settings'),
    ).not.toBeNull();
  });

  it('offers the snapping switches and grid patterns by default', () => {
    renderToolbar();

    expect(document.querySelectorAll('[role="menuitemcheckbox"]')).toHaveLength(
      2,
    );
    expect(
      document.querySelectorAll('.menu-item-radio-indicator'),
    ).toHaveLength(3);
  });

  it('omits the snapping switches when disabled', () => {
    renderToolbar({ snapping: false });

    expect(document.querySelectorAll('[role="menuitemcheckbox"]')).toHaveLength(
      0,
    );
    expect(
      document.querySelectorAll('.menu-item-radio-indicator'),
    ).toHaveLength(3);
  });
});
