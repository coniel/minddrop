import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseTemplates, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  fillForm,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { OpenNewDatabaseDialogEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { NewDatabaseDialog } from './NewDatabaseDialog';

const name = 'Test Database';
const entryName = 'Test Entry';

// Fills in the dialog's name fields and submits it
async function submitForm(values: { name?: string; entryName?: string } = {}) {
  const user = userEvent.setup();

  await fillForm({
    name: values.name ?? name,
    entryName: values.entryName ?? entryName,
  });

  await user.click(screen.getByText('databases.form.actions.create'));
}

describe('<NewDatabaseDialog />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens on open event', async () => {
    render(<NewDatabaseDialog />);

    Events.dispatch(OpenNewDatabaseDialogEvent);

    await waitFor(() => {
      screen.getByText('databases.templates.blank.description');
    });
  });

  it('closes on cancel', async () => {
    render(<NewDatabaseDialog defaultOpen />);
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.cancel'));

    await waitFor(() => {
      expect(
        screen.queryByText('databases.templates.blank.description'),
      ).toBeNull();
    });
  });

  it('selects a template on click', async () => {
    render(<NewDatabaseDialog defaultOpen />);
    const user = userEvent.setup();

    // Pick the first non-blank template
    const template = DatabaseTemplates.Store.getAllArray().find(
      (candidate) => candidate.name !== 'Blank',
    )!;

    await user.click(screen.getByText(template.name));

    // The template's entry name is applied to the form
    await waitFor(() => {
      const input = screen
        .getAllByRole('textbox')
        .find((element) => (element as HTMLInputElement).name === 'entryName');

      expect((input as HTMLInputElement).value).toBe(template.entryName);
    });
  });

  it('creates a database from the form values', async () => {
    render(<NewDatabaseDialog defaultOpen />);

    await submitForm();

    await waitFor(() => {
      const database = Databases.Store.getAllArray().find(
        (candidate) => candidate.name === name,
      );

      expect(database).toBeDefined();
      expect(database?.entryName).toBe(entryName);
    });
  });

  it('does not create a database without a name', async () => {
    render(<NewDatabaseDialog defaultOpen />);

    const before = Databases.Store.getAllArray().length;

    await submitForm({ name: '' });

    // The required field error is shown and no database is created
    await waitFor(() => {
      screen.getByText('formErrors.required');
    });

    expect(Databases.Store.getAllArray()).toHaveLength(before);
  });

  it('does not create a database with a conflicting name', async () => {
    render(<NewDatabaseDialog defaultOpen />);

    const existing = Databases.Store.getAllArray()[0];
    const before = Databases.Store.getAllArray().length;

    await submitForm({ name: existing.name });

    await waitFor(() => {
      screen.getByText('databases.form.errors.nameConflict');
    });

    expect(Databases.Store.getAllArray()).toHaveLength(before);
  });
});
