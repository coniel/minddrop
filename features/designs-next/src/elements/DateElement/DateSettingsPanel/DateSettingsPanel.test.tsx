import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { DateElement } from '../DateElement.types';
import { DateElementConfig } from '../DateElementConfig';
import { DateSettingsPanel } from './DateSettingsPanel';

const { titleDesignElement } = DesignElementFixtures;

// The settings passed to the most recent change callback
let changedSettings: Partial<DateElement> | null;

/**
 * Renders the panel on a date element with a recording change
 * callback.
 *
 * @param element - The date element the panel configures.
 */
function renderPanel(element: Partial<DateElement> = {}) {
  changedSettings = null;

  render(
    <DateSettingsPanel
      element={{
        ...titleDesignElement,
        type: DateElementConfig.type,
        ...element,
      }}
      onChange={(settings) => {
        changedSettings = settings;
      }}
    />,
  );
}

describe('DateSettingsPanel', () => {
  afterEach(cleanup);

  it('marks the date mode when the element has no mode', () => {
    renderPanel();

    expect(screen.getByLabelText('Date')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('marks the mode the element is set to', () => {
    renderPanel({ mode: 'relative' });

    expect(screen.getByLabelText('Relative')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets the chosen mode', () => {
    renderPanel();

    fireEvent.click(screen.getByLabelText('Relative'));

    expect(changedSettings).toEqual({ mode: 'relative' });
  });

  it('shows the medium style when the element has none set', () => {
    renderPanel();

    expect(screen.getByRole('combobox')).toHaveTextContent(/^5 Mar 2026$/);
  });

  it('shows the style the element is set to', () => {
    renderPanel({ dateStyle: 'long' });

    expect(screen.getByRole('combobox')).toHaveTextContent(/^5 March 2026$/);
  });

  it('sets the chosen style', async () => {
    renderPanel();

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(await screen.findByText('Thu, 5 Mar 2026'));

    expect(changedSettings).toEqual({ dateStyle: 'full' });
  });

  it('turns the time switch on when the element shows the time', () => {
    renderPanel({ showTime: true });

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('sets whether the time follows the date', () => {
    renderPanel();

    fireEvent.click(screen.getByRole('switch'));

    expect(changedSettings).toEqual({ showTime: true });
  });

  it('hides the style and time in the relative mode', () => {
    renderPanel({ mode: 'relative' });

    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.queryByRole('switch')).toBeNull();
  });
});
