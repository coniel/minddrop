import { afterEach, describe, expect, it } from 'vitest';
import { coverDesignElement } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { HeadingElement } from '../HeadingElement.types';
import { HeadingElementType } from '../HeadingElementConfig';
import { HeadingSettingsControls } from './HeadingSettingsControls';

// A heading element without a level setting
const headingElement: HeadingElement = {
  ...coverDesignElement,
  type: HeadingElementType,
};

// The settings passed to the most recent onSettingsChange call
let changedSettings: Partial<HeadingElement> | null;

/**
 * Renders the settings controls for the given element with a recording
 * callback.
 *
 * @param element - The heading element the menu configures.
 */
function renderMenu(element: HeadingElement = headingElement) {
  changedSettings = null;

  render(
    <HeadingSettingsControls
      element={element}
      onSettingsChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

/**
 * Opens the level menu through its trigger.
 */
function openMenu() {
  fireEvent.click(screen.getByLabelText('Heading level'));
}

describe('HeadingSettingsControls', () => {
  afterEach(cleanup);

  it('holds the levels behind the menu trigger', () => {
    renderMenu();

    expect(screen.queryByLabelText('Heading 1')).toBeNull();
    expect(screen.getByLabelText('Heading level')).toBeInTheDocument();
  });

  it('presses the default level without a level setting', () => {
    renderMenu();
    openMenu();

    expect(screen.getByLabelText('Heading 2')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('presses the level setting', () => {
    renderMenu({ ...headingElement, level: 3 });
    openMenu();

    expect(screen.getByLabelText('Heading 3')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('fires onSettingsChange with the chosen level', () => {
    renderMenu();
    openMenu();

    fireEvent.click(screen.getByLabelText('Heading 1'));

    expect(changedSettings).toEqual({ level: 1 });
  });
});
