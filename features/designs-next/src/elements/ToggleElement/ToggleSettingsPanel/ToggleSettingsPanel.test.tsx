import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { ToggleElement } from '../ToggleElement.types';
import { ToggleElementConfig } from '../ToggleElementConfig';
import { ToggleSettingsPanel } from './ToggleSettingsPanel';

const { iconDesignElement } = DesignElementFixtures;

// The settings passed to the most recent change callback
let changedSettings: Partial<ToggleElement> | null;

/**
 * Renders the panel on a toggle element with a recording change
 * callback.
 *
 * @param element - The toggle element the panel configures.
 */
function renderPanel(element: Partial<ToggleElement> = {}) {
  changedSettings = null;

  render(
    <ToggleSettingsPanel
      element={{
        ...iconDesignElement,
        type: ToggleElementConfig.type,
        ...element,
      }}
      onChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

describe('ToggleSettingsPanel', () => {
  afterEach(cleanup);

  it('marks checkbox when the element has no style', () => {
    renderPanel();

    expect(screen.getByLabelText('Checkbox')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the style the element is set to', () => {
    renderPanel({ style: 'switch' });

    expect(screen.getByLabelText('Switch')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets the chosen style', () => {
    renderPanel();

    fireEvent.click(screen.getByLabelText('Switch'));

    expect(changedSettings).toEqual({ style: 'switch' });
  });

  it('marks medium when the element has no size', () => {
    renderPanel();

    expect(screen.getByLabelText('Medium')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets the chosen size', () => {
    renderPanel();

    fireEvent.click(screen.getByLabelText('Large'));

    expect(changedSettings).toEqual({ size: 'lg' });
  });

  it('offers the icons to the icon style alone', () => {
    renderPanel({ style: 'switch' });

    expect(screen.queryByLabelText('Checked icon')).toBeNull();
  });

  // Picking an icon needs a loaded icon set in the picker, which
  // is left to e2e. Clearing goes through the same picker, so it
  // stands in for the wiring of each state's picker.
  it('clears the checked icon', async () => {
    renderPanel({ style: 'icon', checkedIcon: 'lucide:star:default' });

    await userEvent.click(screen.getByLabelText('Checked icon'));
    await userEvent.click(screen.getByText('Clear'));

    expect(changedSettings).toEqual({ checkedIcon: undefined });
  });

  it('clears the unchecked icon', async () => {
    renderPanel({ style: 'icon', uncheckedIcon: 'lucide:star:default' });

    await userEvent.click(screen.getByLabelText('Unchecked icon'));
    await userEvent.click(screen.getByText('Clear'));

    expect(changedSettings).toEqual({ uncheckedIcon: undefined });
  });
});
