import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { ImageElement } from '../ImageElement.types';
import { ImageElementConfig } from '../ImageElementConfig';
import { ImageSettingsPanel } from './ImageSettingsPanel';

const { coverDesignElement } = DesignElementFixtures;

// The settings passed to the most recent change callback
let changedSettings: Partial<ImageElement> | null;

/**
 * Renders the panel on an image element with a recording change
 * callback.
 *
 * @param element - The image element the panel configures.
 */
function renderPanel(element: Partial<ImageElement> = {}) {
  changedSettings = null;

  render(
    <ImageSettingsPanel
      element={{
        ...coverDesignElement,
        type: ImageElementConfig.type,
        ...element,
      }}
      onChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

describe('ImageSettingsPanel', () => {
  afterEach(cleanup);

  it('marks cover when the element has no fit set', () => {
    renderPanel();

    expect(screen.getByLabelText('Cover')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the fit the element is set to', () => {
    renderPanel({ fit: 'contain' });

    expect(screen.getByLabelText('Contain')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets the chosen fit', () => {
    renderPanel();

    fireEvent.click(screen.getByLabelText('Fill'));

    expect(changedSettings).toEqual({ fit: 'fill' });
  });
});
