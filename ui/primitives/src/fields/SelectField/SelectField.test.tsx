import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { SelectOption } from '../../Select';
import { FieldValidate } from '../useFieldValidation';
import { SelectField } from './SelectField';

const options: SelectOption<string>[] = [
  { stringLabel: 'Allowed', value: 'allowed' },
  { stringLabel: 'Blocked', value: 'blocked' },
];

// Rejects the blocked option
const rejectBlocked: FieldValidate<string | number> = (value) =>
  value === 'blocked' ? { string: 'Not available' } : false;

/**
 * Selects an option of the open field's select.
 *
 * @param user - The user event instance.
 * @param label - The option's label.
 */
async function selectOption(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
): Promise<void> {
  await user.click(screen.getByRole('combobox'));
  await user.click(await screen.findByRole('option', { name: label }));
}

describe('<SelectField />', () => {
  afterEach(cleanup);

  it('validates each selected value', async () => {
    const user = userEvent.setup();

    render(<SelectField options={options} validate={rejectBlocked} />);

    await selectOption(user, 'Blocked');

    expect(screen.getByText('Not available')).toBeInTheDocument();
  });

  it('shows a validation error over the given error', async () => {
    const user = userEvent.setup();

    render(
      <SelectField
        options={options}
        stringError="Given error"
        validate={rejectBlocked}
      />,
    );

    await selectOption(user, 'Blocked');

    expect(screen.getByText('Not available')).toBeInTheDocument();
    expect(screen.queryByText('Given error')).not.toBeInTheDocument();
  });

  it('clears the error once an accepted value is selected', async () => {
    const user = userEvent.setup();

    render(<SelectField options={options} validate={rejectBlocked} />);

    // Select a rejected value, then an accepted one
    await selectOption(user, 'Blocked');
    await selectOption(user, 'Allowed');

    expect(screen.queryByText('Not available')).not.toBeInTheDocument();
  });
});
