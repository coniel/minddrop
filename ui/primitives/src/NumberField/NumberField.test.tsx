import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { FieldValidate } from '../fields/useFieldValidation';
import { NumberField } from './NumberField';

// Rejects a negative number
const rejectNegatives: FieldValidate<number | null> = (value) =>
  value !== null && value < 0 ? { string: 'Must be positive' } : false;

describe('<NumberField />', () => {
  afterEach(cleanup);

  it('validates the value when the input loses focus', async () => {
    const user = userEvent.setup();

    render(<NumberField stringLabel="Count" validate={rejectNegatives} />);

    await user.type(screen.getByLabelText('Count'), '-5');
    await user.tab();

    expect(screen.getByText('Must be positive')).toBeInTheDocument();
  });

  it('validates a controlled value the parent changed', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <NumberField stringLabel="Count" value={1} validate={rejectNegatives} />,
    );

    // Change the value from outside the input
    rerender(
      <NumberField stringLabel="Count" value={-5} validate={rejectNegatives} />,
    );

    // Focus and leave the input without typing
    await user.click(screen.getByLabelText('Count'));
    await user.tab();

    expect(screen.getByText('Must be positive')).toBeInTheDocument();
  });

  it('clears the error once the value changes', async () => {
    const user = userEvent.setup();

    render(<NumberField stringLabel="Count" validate={rejectNegatives} />);

    // Enter a rejected value, then edit it
    await user.type(screen.getByLabelText('Count'), '-5');
    await user.tab();
    await user.type(screen.getByLabelText('Count'), '1');

    expect(screen.queryByText('Must be positive')).not.toBeInTheDocument();
  });

  it('keeps a hidden label on the input for assistive technology', () => {
    render(<NumberField stringLabel="Count" hideLabel />);

    // The hiding itself is CSS the test environment cannot see
    expect(screen.getByLabelText('Count')).toBeInTheDocument();
  });
});
