import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { I18n, i18n } from '@minddrop/i18n';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { FieldValidationError } from '../useFieldValidation';
import { ChipsField, ChipsFieldProps } from './ChipsField';

// Register the interpolated key the tests reject values with, which
// belongs to a package this one does not depend on.
I18n.registerTranslations({
  'en-GB': {
    databases: {
      settings: {
        contentDefaults: {
          custom: { matcherTaken: 'Already used by {{type}}' },
        },
      },
    },
  },
});

// The error text of an invalid name
const invalidNameError = i18n.t('error.invalidDirName');

interface HarnessProps
  extends Partial<Omit<ChipsFieldProps, 'value' | 'onValueChange'>> {
  /**
   * The chips the harness starts with.
   */
  initialValue?: string[];
}

/**
 * Renders a chips field with its chips and typed text kept in local
 * state, showing the typed text it reports.
 */
function Harness({ initialValue = [], ...props }: HarnessProps) {
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <ChipsField
        stringLabel="Names"
        value={value}
        onValueChange={setValue}
        onInputValueChange={setInputValue}
        {...props}
      />
      <output>{inputValue}</output>
    </>
  );
}

/**
 * Rejects every value containing a slash with the invalid name error.
 *
 * @param value - The typed value.
 * @returns The invalid name error, or false for a valid value.
 */
function rejectSlashes(value: string): FieldValidationError | false {
  if (value.includes('/')) {
    return 'error.invalidDirName';
  }

  return false;
}

describe('<ChipsField />', () => {
  afterEach(cleanup);

  it('shows the translated error of a rejected value', async () => {
    const user = userEvent.setup();

    render(<Harness validate={rejectSlashes} />);

    await user.type(screen.getByLabelText('Names'), 'a/b{Enter}');

    expect(screen.getByText(invalidNameError)).toBeInTheDocument();
    expect(screen.getByLabelText('Names')).toHaveValue('a/b');
  });

  it('shows the translated error with its values', async () => {
    const user = userEvent.setup();

    render(
      <Harness
        validate={() => ({
          key: 'databases.settings.contentDefaults.custom.matcherTaken',
          values: { type: 'Images' },
        })}
      />,
    );

    await user.type(screen.getByLabelText('Names'), 'png{Enter}');

    expect(screen.getByText('Already used by Images')).toBeInTheDocument();
  });

  it('shows a plain string error as is', async () => {
    const user = userEvent.setup();

    render(<Harness validate={() => ({ string: 'Not allowed' })} />);

    await user.type(screen.getByLabelText('Names'), 'a{Enter}');

    expect(screen.getByText('Not allowed')).toBeInTheDocument();
  });

  it('adds a value the validation accepts', async () => {
    const user = userEvent.setup();

    render(<Harness validate={rejectSlashes} />);

    await user.type(screen.getByLabelText('Names'), 'notes{Enter}');

    expect(
      screen.getByRole('button', { name: 'Remove notes' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(invalidNameError)).not.toBeInTheDocument();
  });

  it('clears the error once the typed text changes', async () => {
    const user = userEvent.setup();

    render(<Harness validate={rejectSlashes} />);

    // Type a rejected value, then edit it
    await user.type(screen.getByLabelText('Names'), 'a/b{Enter}');
    await user.type(screen.getByLabelText('Names'), 'c');

    expect(screen.queryByText(invalidNameError)).not.toBeInTheDocument();
  });

  it('shows a validation error over the given error', async () => {
    const user = userEvent.setup();

    render(<Harness stringError="Given error" validate={rejectSlashes} />);

    // The given error shows until a value is rejected
    expect(screen.getByText('Given error')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Names'), 'a/b{Enter}');

    expect(screen.getByText(invalidNameError)).toBeInTheDocument();
    expect(screen.queryByText('Given error')).not.toBeInTheDocument();
  });

  it('reports the typed text', async () => {
    const user = userEvent.setup();

    render(<Harness />);

    await user.type(screen.getByLabelText('Names'), 'no');

    expect(screen.getByRole('status')).toHaveTextContent('no');
  });
});
