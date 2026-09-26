import { afterEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { cleanup, render, screen, userEvent } from '@minddrop/test-utils';
import { FieldValidate } from '../fields/useFieldValidation';
import { DateField } from './DateField';

// Rejects a cleared date
const requireDate: FieldValidate<Date | null> = (value) =>
  value === null ? 'formErrors.required' : false;

describe('<DateField />', () => {
  afterEach(cleanup);

  it('validates the date when it is cleared', async () => {
    const user = userEvent.setup();

    render(
      <DateField
        clearable
        stringLabel="Due"
        defaultValue={new Date('2026-01-01T00:00:00.000Z')}
        validate={requireDate}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: i18n.t('actions.clear') }),
    );

    expect(screen.getByText(i18n.t('formErrors.required'))).toBeInTheDocument();
  });

  it('shows no error for an accepted date', async () => {
    const user = userEvent.setup();

    render(
      <DateField
        clearable
        stringLabel="Due"
        defaultValue={new Date('2026-01-01T00:00:00.000Z')}
        validate={() => false}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: i18n.t('actions.clear') }),
    );

    expect(
      screen.queryByText(i18n.t('formErrors.required')),
    ).not.toBeInTheDocument();
  });
});
