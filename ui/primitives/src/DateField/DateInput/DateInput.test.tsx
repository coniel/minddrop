import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { DateInput } from './DateInput';

// The date used by the tests
const AUGUST_15 = new Date(2026, 7, 15);

describe('<DateInput />', () => {
  afterEach(cleanup);

  it('renders the string placeholder while empty', () => {
    render(<DateInput stringPlaceholder="Pick a date" />);

    expect(trigger()).toHaveTextContent('Pick a date');
  });

  it('renders the translated placeholder while empty', () => {
    const { getByTranslatedText } = render(<DateInput placeholder="test" />);

    getByTranslatedText('test');
  });

  it('formats the default value with the medium date style', () => {
    render(<DateInput defaultValue={AUGUST_15} />);

    expect(trigger()).toHaveTextContent('15 Aug 2026');
  });

  it('formats with a custom format function', () => {
    render(
      <DateInput
        defaultValue={AUGUST_15}
        formatDate={(date) => `custom ${date.getDate()}`}
      />,
    );

    expect(trigger()).toHaveTextContent('custom 15');
  });

  it('selects a date from the calendar popover', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={AUGUST_15} />);

    // Open the calendar and pick another day in the month
    await user.click(trigger());
    await user.click(
      await screen.findByRole('button', { name: /August 20th, 2026/ }),
    );

    expect(value()).toHaveTextContent('2026-08-20');
    expect(trigger()).toHaveTextContent('20 Aug 2026');
  });

  it('clears the date from the clear button', async () => {
    const user = userEvent.setup();

    render(<ControlledInput defaultValue={AUGUST_15} clearable />);

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(value()).toHaveTextContent('empty');
    expect(trigger()).not.toHaveTextContent('Aug');
  });

  it('hides the clear button while empty', () => {
    render(<ControlledInput clearable />);

    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });

  it('does not open the calendar when disabled', async () => {
    const user = userEvent.setup();

    render(<DateInput defaultValue={AUGUST_15} disabled />);

    await user.click(trigger());

    // The calendar grid never appears
    await waitFor(() => {
      expect(screen.queryByRole('grid')).toBeNull();
    });
  });

  it('removes the trigger from the tab order when disabled', () => {
    render(<DateInput disabled />);

    expect(trigger()).toHaveAttribute('tabindex', '-1');
  });
});

/**
 * Formats a date's local parts as an ISO-style string.
 */
function localDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/**
 * Returns the date input trigger element.
 */
function trigger(): HTMLElement {
  return document.querySelector('.date-input') as HTMLElement;
}

/**
 * Returns the value shown by the controlled harness.
 */
function value(): HTMLElement {
  return screen.getByTestId('value');
}

interface ControlledInputProps {
  defaultValue?: Date | null;
  clearable?: boolean;
}

/**
 * Renders a controlled date input exposing its value as an ISO date.
 */
const ControlledInput: React.FC<ControlledInputProps> = ({
  defaultValue = null,
  clearable,
}) => {
  const [date, setDate] = useState<Date | null>(defaultValue);

  return (
    <>
      <DateInput value={date} onValueChange={setDate} clearable={clearable} />
      <output data-testid="value">{date ? localDate(date) : 'empty'}</output>
    </>
  );
};
