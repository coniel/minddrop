import { afterEach, describe, expect, it } from 'vitest';
import { ElementHeightMode, ElementWidthMode } from '@minddrop/designs-next';
import { iconDesignElement } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../test-utils';
import { BlockEditorElementMenu } from './BlockEditorElementMenu';

// The width mode passed to the most recent onWidthModeChange call
let changedWidthMode: ElementWidthMode | null;

// The height mode passed to the most recent onHeightModeChange call
let changedHeightMode: ElementHeightMode | null;

// The flag passed to the most recent onNaturalHeightChange call
let changedNaturalHeight: boolean | null;

interface RenderMenuOptions {
  pinOverridden?: boolean;
  aspectLocked?: boolean;
  verticalPinOverridden?: boolean;
}

/**
 * Renders the menu for the icon fixture element with recording
 * callbacks.
 *
 * @param options - The menu's flag props.
 * @returns The render container.
 */
function renderMenu(options: RenderMenuOptions = {}) {
  changedWidthMode = null;
  changedHeightMode = null;
  changedNaturalHeight = null;

  const { container } = render(
    <BlockEditorElementMenu
      element={iconDesignElement}
      pinOverridden={options.pinOverridden ?? false}
      aspectLocked={options.aspectLocked ?? false}
      verticalPinOverridden={options.verticalPinOverridden ?? false}
      onWidthModeChange={(widthMode) => {
        changedWidthMode = widthMode;
      }}
      onHeightModeChange={(heightMode) => {
        changedHeightMode = heightMode;
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
    const container = renderMenu({ pinOverridden: true });

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

  it('offers height modes instead of natural height when aspect-locked', () => {
    renderMenu({ aspectLocked: true });

    // The element has no height mode, meaning fluid
    expect(screen.getByLabelText('Fluid height')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.queryByLabelText('Natural height')).toBeNull();
  });

  it('fires onHeightModeChange with the chosen mode', () => {
    renderMenu({ aspectLocked: true });

    fireEvent.click(screen.getByLabelText('Fixed height, pinned top'));

    expect(changedHeightMode).toBe('fixed-top');
  });

  it('mutes the vertical pin choices while overridden', () => {
    const container = renderMenu({
      aspectLocked: true,
      verticalPinOverridden: true,
    });

    // The three vertical pin toggles mute
    expect(
      container.querySelectorAll('.block-editor-element-menu-pin-overridden'),
    ).toHaveLength(3);
  });
});
