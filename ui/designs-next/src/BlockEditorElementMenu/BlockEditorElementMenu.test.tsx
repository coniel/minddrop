import { afterEach, describe, expect, it } from 'vitest';
import { ElementWidthMode } from '@minddrop/designs-next';
import { iconDesignElement } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { BlockEditorElementMenu } from './BlockEditorElementMenu';

// The width mode passed to the most recent onWidthModeChange call
let changedWidthMode: ElementWidthMode | null;

// The flag passed to the most recent onNaturalHeightChange call
let changedNaturalHeight: boolean | null;

/**
 * Renders the menu for the icon fixture element with recording
 * callbacks.
 *
 * @param pinOverridden - The pin override flag.
 * @returns The render container.
 */
function renderMenu(pinOverridden = false) {
  changedWidthMode = null;
  changedNaturalHeight = null;

  const { container } = render(
    <BlockEditorElementMenu
      element={iconDesignElement}
      pinOverridden={pinOverridden}
      onWidthModeChange={(widthMode) => {
        changedWidthMode = widthMode;
      }}
      onNaturalHeightChange={(naturalHeight) => {
        changedNaturalHeight = naturalHeight;
      }}
    />,
  );

  return container;
}

describe('BlockEditorElementMenu', () => {
  afterEach(cleanup);

  it('renders a toggle per width mode with the current mode pressed', () => {
    renderMenu();

    // The icon fixture is pinned right
    expect(screen.getByLabelText('Fluid width')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByLabelText('Fixed width, pinned right')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('fires onWidthModeChange with the chosen mode', () => {
    renderMenu();

    fireEvent.click(screen.getByLabelText('Fixed width, pinned left'));

    expect(changedWidthMode).toBe('fixed-left');
  });

  it('reflects and toggles natural height', () => {
    renderMenu();

    const toggle = screen.getByLabelText('Natural height');

    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggle);

    expect(changedNaturalHeight).toBe(true);
  });

  it('mutes the pin choices while overridden', () => {
    const container = renderMenu(true);

    // The three pin toggles mute, the fluid toggle does not
    expect(
      container.querySelectorAll('.block-editor-element-menu-pin-overridden'),
    ).toHaveLength(3);
  });

  it('does not mute the pin choices without an override', () => {
    const container = renderMenu();

    expect(
      container.querySelectorAll('.block-editor-element-menu-pin-overridden'),
    ).toHaveLength(0);
  });
});
