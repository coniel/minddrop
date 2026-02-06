import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  BooksDatabaseTemplate,
  Database,
  DatabaseCreatedEvent,
  Databases,
  PdfDataType,
  UrlDataType,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import {
  emojiIconString,
  fillForm,
  pickEmojiIcon,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Paths } from '@minddrop/utils';
import { OpenNewDatabaseDialogEvent } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { NewDatabaseDialog } from './NewDatabaseDialog';

const entryName = 'Test Entry';
const name = 'Test Database';

interface FormOptions {
  dataType: string;
  entryName: string;
  name: string;
}

const defultFormOptions: FormOptions = {
  name: name,
  entryName: entryName,
  dataType: UrlDataType.name,
};

async function submitNewDatabaseForm(options: FormOptions = defultFormOptions) {
  const rendered = render(<NewDatabaseDialog defaultOpen />);
  const user = userEvent.setup();
  const { getByText } = rendered;

  // Pick URL data type
  await user.click(screen.getByText(options.dataType));

  // Pick icon
  await pickEmojiIcon('databases.form.icon.label');

  // Fill out names
  await fillForm({
    name: options.name,
    entryName: options.entryName,
  });

  // Submit the form
  await user.click(getByText('databases.form.actions.create'));

  return rendered;
}

describe('<NewDatabaseDialog />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens on open event', async () => {
    render(<NewDatabaseDialog />);

    Events.dispatch(OpenNewDatabaseDialogEvent);

    await waitFor(() => {
      screen.getByText('databases.form.getStarted.title');
    });
  });

  it('closes on cancel', async () => {
    render(<NewDatabaseDialog defaultOpen />);
    const user = userEvent.setup();

    // Click the cancel button
    await user.click(screen.getByText('actions.cancel'));

    await waitFor(() => {
      expect(screen.queryByText('databases.form.getStarted.title')).toBeNull();
    });
  });

  it('selects a data type on click', async () => {
    render(<NewDatabaseDialog defaultOpen />);
    const user = userEvent.setup();

    // Click the URL data type
    await user.click(screen.getByText(UrlDataType.name));

    // Should render the data type description
    await waitFor(() => {
      screen.getByText(UrlDataType.description);
    });
    // Should hide get started message
    expect(screen.queryByText('databases.form.getStarted.title')).toBeNull();
  });

  it('creates a new database with all provided properties', () =>
    new Promise<void>((resolve) => {
      // Listen for the database creation event
      Events.addListener<Database>(
        DatabaseCreatedEvent,
        'test',
        ({ data: database }) => {
          expect(database.entryName).toBe(entryName);
          expect(database.name).toBe(name);
          expect(database.dataType).toBe(UrlDataType.type);
          expect(database.icon).toBe(emojiIconString);
          resolve();
        },
      );

      // Fill and submit the new database form
      submitNewDatabaseForm();
    }));

  describe('name validation', () => {
    it('requires a name', async () => {
      await submitNewDatabaseForm({
        ...defultFormOptions,
        name: '',
      });

      await waitFor(() => {
        screen.getByText('formErrors.required');
      });
    });

    it('requires a unique name', async () => {
      // Add an existing database to test against
      await Databases.create(Paths.workspace, {
        dataType: UrlDataType.type,
        entryName: 'Some Entry',
        name,
        icon: emojiIconString,
      });

      await submitNewDatabaseForm();

      await waitFor(() => {
        screen.getByText(i18n.t('databases.form.errors.nameConflict'));
      });
    });

    it('ensures there is no directory path conflict', async () => {
      // Create a directory that conflicts with the database path
      MockFs.createDir(`${Paths.workspace}/${defultFormOptions.name}`);

      await submitNewDatabaseForm({
        ...defultFormOptions,
        name,
      });

      await waitFor(() => {
        screen.getByText(i18n.t('databases.form.errors.pathConflict'));
      });
    });
  });

  describe('entryName validation', () => {
    it('requires a entryName', async () => {
      await submitNewDatabaseForm({
        ...defultFormOptions,
        entryName: '',
      });

      await waitFor(() => {
        screen.getByText('formErrors.required');
      });
    });
  });

  describe('default icon', () => {
    it('sets the data type icon as the default', () =>
      new Promise<void>((resolve) => {
        // Listen for the database creation event
        Events.addListener<Database>(
          DatabaseCreatedEvent,
          'test',
          ({ data: database }) => {
            expect(database.icon).toBe(UrlDataType.icon);
            resolve();
          },
        );

        async function fillAndSubmitForm() {
          render(<NewDatabaseDialog defaultOpen />);
          const user = userEvent.setup();

          // Pick URL data type
          await user.click(screen.getByText(UrlDataType.name));

          // Fill out names
          await fillForm({
            entryName,
            name,
          });

          // Submit the form
          await user.click(screen.getByText('databases.form.actions.create'));
        }

        fillAndSubmitForm();
      }));

    it('preserves user selected icon when data type changes', () =>
      new Promise<void>((resolve) => {
        // Listen for the database creation event
        Events.addListener<Database>(
          DatabaseCreatedEvent,
          'test',
          ({ data: database }) => {
            expect(database.icon).toBe(emojiIconString);
            resolve();
          },
        );

        async function fillAndSubmitForm() {
          render(<NewDatabaseDialog defaultOpen />);
          const user = userEvent.setup();

          // Pick URL data type
          await user.click(screen.getByText(UrlDataType.name));

          // Pick icon
          await pickEmojiIcon('databases.form.icon.label');

          // Change data type to PDF
          await user.click(screen.getByText(PdfDataType.name));

          // Fill out names
          await fillForm({
            entryName,
            name,
          });

          // Submit the form
          await user.click(screen.getByText('databases.form.actions.create'));
        }

        fillAndSubmitForm();
      }));
  });

  describe('templates', () => {
    it('creates a database from a template', () =>
      new Promise<void>((resolve) => {
        // Listen for the database creation event
        Events.addListener<Database>(
          DatabaseCreatedEvent,
          'test',
          ({ data: database }) => {
            expect(database.name).toBe(i18n.t(BooksDatabaseTemplate.name));
            expect(database.entryName).toBe(
              i18n.t(BooksDatabaseTemplate.entryName),
            );
            expect(database.icon).toBe(BooksDatabaseTemplate.icon);
            expect(database.dataType).toBe(BooksDatabaseTemplate.dataType);
            expect(database.properties).toEqual(
              BooksDatabaseTemplate.properties.map((property) => ({
                ...property,
                name: i18n.t(property.name),
              })),
            );
            resolve();
          },
        );

        async function fillAndSubmitForm() {
          render(<NewDatabaseDialog defaultOpen />);
          const user = userEvent.setup();

          // Pick Books template
          await user.click(screen.getByText(BooksDatabaseTemplate.name));

          // Submit the form
          await user.click(screen.getByText('databases.form.actions.create'));
        }

        fillAndSubmitForm();
      }));
  });

  describe('on close', () => {
    it('resets the form', async () => {
      render(<NewDatabaseDialog defaultOpen />);
      const user = userEvent.setup();

      // Select a template to fill out the form
      await user.click(screen.getByText(BooksDatabaseTemplate.name));

      // Close the dialog
      await user.click(screen.getByText('actions.cancel'));

      // Wait for the dialog to close
      await waitFor(() => {
        expect(
          screen.queryByText('databases.form.getStarted.title'),
        ).toBeNull();
      });

      // Reopen the dialog
      Events.dispatch(OpenNewDatabaseDialogEvent);

      // Should show get started message
      await waitFor(() => {
        screen.getByText('databases.form.getStarted.title');
      });

      // Select a data type
      await user.click(screen.getByText(UrlDataType.name));

      // Form should be reset
      await waitFor(() => {
        expect(
          screen.getByLabelText<HTMLInputElement>('databases.form.name.label')
            .value,
        ).toBe('');
      });
    });
  });
});
