import { afterEach, describe, expect, it } from 'vitest';
import { coverDesignElement } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../test-utils';
import { HeadingElement } from './HeadingElement.types';
import { HeadingElementType } from './HeadingElementConfig';
import { HeadingSettingsMenu } from './HeadingSettingsMenu';

// A heading element without a level setting
const headingElement: HeadingElement = {
  ...coverDesignElement,
  type: HeadingElementType,
};

// The settings passed to the most recent onSettingsChange call
let changedSettings: Partial<HeadingElement> | null;

/**
 * Renders the settings menu for the given element with a recording
 * callback.
 *
 * @param element - The heading element the menu configures.
 */
function renderMenu(element: HeadingElement = headingElement) {
  changedSettings = null;

  render(
    <HeadingSettingsMenu
      element={element}
      onSettingsChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

describe('HeadingSettingsMenu', () => {
  afterEach(cleanup);

  it('presses the default level without a level setting', () => {
    renderMenu();

    expect(screen.getByLabelText('Heading 2')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('presses the level setting', () => {
    renderMenu({ ...headingElement, level: 3 });

    expect(screen.getByLabelText('Heading 3')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('fires onSettingsChange with the chosen level', () => {
    renderMenu();

    fireEvent.click(screen.getByLabelText('Heading 1'));

    expect(changedSettings).toEqual({ level: 1 });
  });
});
