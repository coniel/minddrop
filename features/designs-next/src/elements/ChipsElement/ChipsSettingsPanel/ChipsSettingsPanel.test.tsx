import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen, within } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { ChipsElement } from '../ChipsElement.types';
import { ChipsElementConfig } from '../ChipsElementConfig';
import { ChipsSettingsPanel } from './ChipsSettingsPanel';

const { bodyDesignElement } = DesignElementFixtures;

// The settings passed to the most recent change callback
let changedSettings: Partial<ChipsElement> | null;

/**
 * Finds a toggle of the panel's size or corner radius group.
 *
 * @param group - The group's name.
 * @param label - The toggle's label.
 * @returns The toggle.
 */
function getToggle(group: string, label: string) {
  return within(screen.getByRole('group', { name: group })).getByLabelText(
    label,
  );
}

/**
 * Renders the panel on a chips element with a recording change
 * callback.
 *
 * @param element - The chips element the panel configures.
 */
function renderPanel(element: Partial<ChipsElement> = {}) {
  changedSettings = null;

  render(
    <ChipsSettingsPanel
      element={{
        ...bodyDesignElement,
        type: ChipsElementConfig.type,
        ...element,
      }}
      onChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

describe('ChipsSettingsPanel', () => {
  afterEach(cleanup);

  it('marks medium when the element has no size', () => {
    renderPanel();

    expect(getToggle('Size', 'Medium')).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks the size the element is set to', () => {
    renderPanel({ size: 'lg' });

    expect(getToggle('Size', 'Large')).toHaveAttribute('aria-pressed', 'true');
  });

  it('sets the chosen size', () => {
    renderPanel();

    fireEvent.click(getToggle('Size', 'Large'));

    expect(changedSettings).toEqual({ size: 'lg' });
  });

  it('marks the small radius when the element has none set', () => {
    renderPanel();

    expect(getToggle('Corner radius', 'Small')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the corner radius the element is set to', () => {
    renderPanel({ cornerRadius: 'full' });

    expect(getToggle('Corner radius', 'Full')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets the chosen corner radius', () => {
    renderPanel();

    fireEvent.click(getToggle('Corner radius', 'Full'));

    expect(changedSettings).toEqual({ cornerRadius: 'full' });
  });
});
