import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { Calendar } from './Calendar';

// The month shown by the tests
const AUGUST = new Date(2026, 7, 1);

describe('<Calendar />', () => {
  afterEach(cleanup);

  it('renders the translated short weekday headers', () => {
    render(<Calendar defaultMonth={AUGUST} />);

    // Every short weekday name appears in the grid header
    ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach((weekday) => {
      expect(screen.getByText(weekday)).toBeInTheDocument();
    });
  });

  it('shows the short month name in the month dropdown', () => {
    render(<Calendar mode="single" defaultMonth={AUGUST} />);

    // The trigger shows the short name; the full name only appears
    // among the dropdown's options once opened
    expect(screen.getByText('Aug')).toBeInTheDocument();
    expect(screen.queryByText('August')).toBeNull();
  });

  it('shows the configured month', () => {
    render(<Calendar mode="single" defaultMonth={AUGUST} />);

    expect(dayButton(/August 15th, 2026/)).toBeInTheDocument();
  });

  it('navigates to the next month', async () => {
    const user = userEvent.setup();

    render(<Calendar mode="single" defaultMonth={AUGUST} />);

    await user.click(screen.getByRole('button', { name: 'Next month' }));

    expect(dayButton(/September 15th, 2026/)).toBeInTheDocument();
  });

  it('navigates to the previous month', async () => {
    const user = userEvent.setup();

    render(<Calendar mode="single" defaultMonth={AUGUST} />);

    await user.click(screen.getByRole('button', { name: 'Previous month' }));

    expect(dayButton(/July 15th, 2026/)).toBeInTheDocument();
  });

  it('selects a day in single mode', async () => {
    const user = userEvent.setup();

    render(<SingleSelectCalendar />);

    await user.click(dayButton(/August 20th, 2026/));

    expect(screen.getByTestId('selected')).toHaveTextContent('2026-08-20');
  });

  it('marks the selected day', async () => {
    const user = userEvent.setup();

    render(<SingleSelectCalendar />);

    await user.click(dayButton(/August 20th, 2026/));

    expect(
      dayButton(/August 20th, 2026/).closest('.calendar-day-selected'),
    ).not.toBeNull();
  });

  it('marks the range ends in range mode', async () => {
    const user = userEvent.setup();

    render(<RangeSelectCalendar />);

    // Pick the range's start and end days
    await user.click(dayButton(/August 10th, 2026/));
    await user.click(dayButton(/August 14th, 2026/));

    expect(
      dayButton(/August 10th, 2026/).closest('.calendar-day-range-start'),
    ).not.toBeNull();
    expect(
      dayButton(/August 14th, 2026/).closest('.calendar-day-range-end'),
    ).not.toBeNull();

    // A day between the ends is marked as range middle
    expect(
      dayButton(/August 12th, 2026/).closest('.calendar-day-range-middle'),
    ).not.toBeNull();
  });

  it('marks today', () => {
    render(<Calendar mode="single" />);

    const today = new Date();

    expect(
      screen
        .getByRole('button', { name: /^Today/ })
        .closest('.calendar-day-today'),
    ).not.toBeNull();
    expect(dayButton(/^Today/).textContent).toBe(String(today.getDate()));
  });

  it('disables days outside the allowed range', () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={AUGUST}
        disabled={{ after: new Date(2026, 7, 15) }}
      />,
    );

    expect(dayButton(/August 16th, 2026/)).toBeDisabled();
    expect(dayButton(/August 15th, 2026/)).not.toBeDisabled();
  });
});

/**
 * Returns the day button whose accessible name matches.
 */
function dayButton(name: RegExp): HTMLElement {
  return screen.getByRole('button', { name });
}

/**
 * Renders a single-select calendar exposing the selection as text.
 */
const SingleSelectCalendar: React.FC = () => {
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <>
      <Calendar
        mode="single"
        defaultMonth={AUGUST}
        selected={selected}
        onSelect={setSelected}
      />
      <output data-testid="selected">
        {selected ? localDate(selected) : 'none'}
      </output>
    </>
  );
};

/**
 * Renders a range-select calendar.
 */
const RangeSelectCalendar: React.FC = () => {
  const [selected, setSelected] = useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      defaultMonth={AUGUST}
      selected={selected}
      onSelect={setSelected}
    />
  );
};

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
