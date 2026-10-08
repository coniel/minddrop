import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { DesignElementFixtures } from '@minddrop/designs-next/test-utils';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup } from '../../../test-utils';
import { NumberElement } from '../NumberElement.types';
import { NumberElementConfig } from '../NumberElementConfig';
import { NumberSettingsPanel } from './NumberSettingsPanel';

const { titleDesignElement } = DesignElementFixtures;

// The settings passed to the most recent change callback
let changedSettings: Partial<NumberElement> | null;

/**
 * Renders the panel on a number element, applying each change to
 * the element as the block controls do and recording it.
 *
 * @param element - The number element the panel configures.
 */
function renderPanel(element: Partial<NumberElement> = {}) {
  changedSettings = null;

  render(
    <PanelHarness
      initialElement={{
        ...titleDesignElement,
        type: NumberElementConfig.type,
        ...element,
      }}
    />,
  );
}

/**
 * Renders the panel on an element held in state, which each change
 * is merged into.
 */
const PanelHarness: React.FC<{ initialElement: NumberElement }> = ({
  initialElement,
}) => {
  const [element, setElement] = useState(initialElement);

  // Records the change and merges it into the element
  function handleChange(settings: Partial<NumberElement>) {
    changedSettings = settings;
    setElement((current) => ({ ...current, ...settings }));
  }

  return <NumberSettingsPanel element={element} onChange={handleChange} />;
};

describe('NumberSettingsPanel', () => {
  afterEach(cleanup);

  it('shows as is when the element has no decimal places set', () => {
    renderPanel();

    expect(
      screen.getByRole('combobox', { name: 'Decimal places' }),
    ).toHaveTextContent(/^As is$/);
  });

  it('shows the decimal places the element is set to', () => {
    renderPanel({ decimals: 2 });

    expect(
      screen.getByRole('combobox', { name: 'Decimal places' }),
    ).toHaveTextContent(/^2$/);
  });

  it('sets the chosen decimal places', async () => {
    renderPanel();

    await userEvent.click(
      screen.getByRole('combobox', { name: 'Decimal places' }),
    );
    await userEvent.click(await screen.findByRole('option', { name: '3' }));

    expect(changedSettings).toEqual({ decimals: 3 });
  });

  it('clears the decimal places when as is is chosen', async () => {
    renderPanel({ decimals: 2 });

    await userEvent.click(
      screen.getByRole('combobox', { name: 'Decimal places' }),
    );
    await userEvent.click(await screen.findByRole('option', { name: 'As is' }));

    expect(changedSettings).toEqual({ decimals: undefined });
  });

  it('marks no separator when the element has none set', () => {
    renderPanel();

    expect(screen.getByLabelText('None')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sets the chosen separator', () => {
    renderPanel();

    fireEvent.click(screen.getByLabelText('Space'));

    expect(changedSettings).toEqual({ separator: 'space' });
  });

  it('shows auto when the element has no sign display set', () => {
    renderPanel();

    expect(screen.getByRole('combobox', { name: 'Sign' })).toHaveTextContent(
      /^Auto$/,
    );
  });

  it('shows the sign display the element is set to', () => {
    renderPanel({ signDisplay: 'never' });

    expect(screen.getByRole('combobox', { name: 'Sign' })).toHaveTextContent(
      /^Never$/,
    );
  });

  it('sets the chosen sign display', async () => {
    renderPanel();

    await userEvent.click(screen.getByRole('combobox', { name: 'Sign' }));
    await userEvent.click(
      await screen.findByRole('option', { name: 'Always' }),
    );

    expect(changedSettings).toEqual({ signDisplay: 'always' });
  });

  it('turns the compact switch off when the element has no notation set', () => {
    renderPanel();

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('turns the compact switch on for a compact element', () => {
    renderPanel({ notation: 'compact' });

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('writes the number compact when the switch is turned on', () => {
    renderPanel();

    fireEvent.click(screen.getByRole('switch'));

    expect(changedSettings).toEqual({ notation: 'compact' });
  });

  it('clears the notation when the switch is turned off', () => {
    renderPanel({ notation: 'compact' });

    fireEvent.click(screen.getByRole('switch'));

    expect(changedSettings).toEqual({ notation: undefined });
  });

  it('sets the typed prefix', async () => {
    renderPanel();

    await userEvent.type(screen.getByLabelText('Prefix'), 'USD ');

    expect(changedSettings).toEqual({ prefix: 'USD ' });
  });

  it('clears the suffix once its field is emptied', async () => {
    renderPanel({ suffix: 'm' });

    await userEvent.clear(screen.getByLabelText('Suffix'));

    expect(changedSettings).toEqual({ suffix: undefined });
  });
});
