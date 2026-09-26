import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { FieldValidate } from '../useFieldValidation';
import { TextField } from './TextField';

// Rejects a value containing a slash
const rejectSlashes: FieldValidate<string> = (value) =>
  value.includes('/') ? { string: 'No slashes' } : false;

describe('<TextField />', () => {
  afterEach(cleanup);

  it('validates the value when Enter is pressed', async () => {
    const user = userEvent.setup();

    render(<TextField stringLabel="Name" validate={rejectSlashes} />);

    await user.type(screen.getByLabelText('Name'), 'a/b{Enter}');

    expect(screen.getByText('No slashes')).toBeInTheDocument();
  });

  it('validates the value when the input loses focus', async () => {
    const user = userEvent.setup();

    render(<TextField stringLabel="Name" validate={rejectSlashes} />);

    await user.type(screen.getByLabelText('Name'), 'a/b');
    await user.tab();

    expect(screen.getByText('No slashes')).toBeInTheDocument();
  });

  it('does not validate the value while it is typed', async () => {
    const user = userEvent.setup();

    render(<TextField stringLabel="Name" validate={rejectSlashes} />);

    await user.type(screen.getByLabelText('Name'), 'a/b');

    expect(screen.queryByText('No slashes')).not.toBeInTheDocument();
  });

  it('clears the error once the value changes', async () => {
    const user = userEvent.setup();

    render(<TextField stringLabel="Name" validate={rejectSlashes} />);

    // Enter a rejected value, then edit it
    await user.type(screen.getByLabelText('Name'), 'a/b{Enter}');
    await user.type(screen.getByLabelText('Name'), 'c');

    expect(screen.queryByText('No slashes')).not.toBeInTheDocument();
  });

  it('shows a validation error over the given error', async () => {
    const user = userEvent.setup();

    render(
      <TextField
        stringLabel="Name"
        stringError="Given error"
        validate={rejectSlashes}
      />,
    );

    await user.type(screen.getByLabelText('Name'), 'a/b{Enter}');

    expect(screen.getByText('No slashes')).toBeInTheDocument();
    expect(screen.queryByText('Given error')).not.toBeInTheDocument();
  });
});
