import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseUpdatedEvent } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import { TextPropertySchema } from '@minddrop/properties';
import {
  emojiIconString,
  fillForm,
  pickEmojiIcon,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import {
  DatabasePropertyEditor,
  DatabasePropertyEditorProps,
} from './DatabasePropertyEditor';

const property = DatabaseFixtures.objectDatabase.properties[0];
const property2 = DatabaseFixtures.objectDatabase.properties[1];

describe('<DatabasePropertyEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('existing property', () => {
    async function updatePropertyIcon() {
      const user = userEvent.setup();

      render(
        <DatabasePropertyEditor
          databaseId={DatabaseFixtures.objectDatabase.id}
          property={property}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(property.name));

      // Pick a new icon
      await pickEmojiIcon('properties.form.icon.label');

      // Save the changes
      await user.click(screen.getByText('actions.save'));
    }

    it('updates the property on save', () =>
      new Promise<void>((done) => {
        // Listen for database updates and verify the property was updated
        Events.addListener(DatabaseUpdatedEvent, 'test', (data) => {
          expect(
            data.updated.properties.find(
              (candidate) => candidate.name === property.name,
            )?.icon,
          ).toBe(emojiIconString);
          done();
        });

        updatePropertyIcon();
      }));

    it('closes the editor on successful save', async () => {
      await updatePropertyIcon();

      // Editor should be closed
      await waitFor(() => {
        expect(screen.getByText('actions.save')).not.toBeVisible();
      });
    });

    describe('renaming', () => {
      async function renameProperty() {
        const user = userEvent.setup();

        render(
          <DatabasePropertyEditor
            databaseId={DatabaseFixtures.objectDatabase.id}
            property={property}
          />,
        );

        // Open the editor
        await user.click(screen.getByText(property.name));

        // Change the name
        await fillForm({ name: 'New Property Name' });

        // Save the changes
        await user.click(screen.getByText('actions.save'));
      }

      it('confirms before renaming the property', () =>
        new Promise<void>((done) => {
          // Listen for the confirmation dialog event
          Events.addListener(OpenConfirmationDialogEvent, 'test', (data) => {
            // Confirm the rename action
            data.onConfirm();
          });

          // TODO: Assert the property was renamed once renaming is implemented
          Events.addListener(DatabaseUpdatedEvent, 'test', () => {
            done();
          });

          renameProperty();
        }));

      it('closes the form after renaming', () =>
        new Promise<void>((done) => {
          // Listen for the confirmation dialog event
          Events.addListener(
            OpenConfirmationDialogEvent,
            'test',
            async (data) => {
              // Confirm the rename action
              data.onConfirm();
              // Form should be closed
              await waitFor(() => {
                expect(screen.getByText('actions.save')).not.toBeVisible();
              });

              done();
            },
          );

          renameProperty();
        }));

      it('does nothing on cancel', () =>
        new Promise<void>((done) => {
          // Listen for the confirmation dialog event
          Events.addListener(OpenConfirmationDialogEvent, 'test', (data) => {
            // Cancel the rename action
            data.onCancel!();
            // Form should be still open
            expect(screen.getByText('actions.save')).toBeVisible();

            done();
          });

          renameProperty();
        }));
    });

    describe('deleting', () => {
      async function clickDeleteProperty() {
        const user = userEvent.setup();

        render(
          <DatabasePropertyEditor
            databaseId={DatabaseFixtures.objectDatabase.id}
            property={property}
          />,
        );

        // Open the editor
        await user.click(screen.getByText(property.name));

        // Delete the property
        await user.click(screen.getByText('actions.delete'));
      }

      it('confirms before deleting the property', () =>
        new Promise<void>((done) => {
          // Listen for the confirmation dialog event
          Events.addListener(OpenConfirmationDialogEvent, 'test', (data) => {
            // Confirm the delete action
            data.onConfirm();
          });

          // Listen for database updates and verify the property was deleted
          Events.addListener(DatabaseUpdatedEvent, 'test', (data) => {
            expect(
              data.updated.properties.find(
                (candidate) => candidate.name === property.name,
              ),
            ).toBeUndefined();
            done();
          });

          clickDeleteProperty();
        }));
    });
  });

  describe('draft property', () => {
    function renderDraftEditor(
      props: Partial<DatabasePropertyEditorProps> = {},
    ) {
      render(
        <DatabasePropertyEditor
          isDraft
          databaseId={DatabaseFixtures.objectDatabase.id}
          property={{
            ...TextPropertySchema,
            name: 'New property',
          }}
          {...props}
        />,
      );
    }

    async function saveDraftProperty(
      props: Partial<DatabasePropertyEditorProps> = {},
    ) {
      const user = userEvent.setup();

      renderDraftEditor(props);

      // Save the new property
      await user.click(screen.getByText('actions.save'));
    }

    it('opens editor by default', () => {
      render(
        <DatabasePropertyEditor
          isDraft
          databaseId={DatabaseFixtures.objectDatabase.id}
          property={{ ...TextPropertySchema, name: 'Text' }}
        />,
      );

      // Editor should be open
      expect(screen.getByText('actions.save')).toBeVisible();
    });

    it('adds the property on save', () =>
      new Promise<void>((done) => {
        // Listen for database updates and verify the property was added
        Events.addListener(DatabaseUpdatedEvent, 'test', (data) => {
          expect(
            data.updated.properties.find(
              (property) => property.name === 'New property',
            ),
          ).toBeDefined();
          done();
        });

        saveDraftProperty();
      }));

    it('calls onSaveDraft callback after saving', async () => {
      const onSaveDraft = vi.fn();

      await saveDraftProperty({ onSaveDraft });

      expect(onSaveDraft).toHaveBeenCalledWith();
    });

    it('calls onCancelDraft callback on cancel', async () => {
      const onCancelDraft = vi.fn();
      const user = userEvent.setup();

      renderDraftEditor({ onCancelDraft });

      // Cancel the new property creation
      await user.click(screen.getByText('actions.cancel'));

      expect(onCancelDraft).toHaveBeenCalledWith();
    });
  });

  describe('validation', () => {
    it('shows an error if the name is empty', async () => {
      const user = userEvent.setup();

      render(
        <DatabasePropertyEditor
          databaseId={DatabaseFixtures.objectDatabase.id}
          property={property}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(property.name));

      // Set the name to just a space
      await fillForm({ name: ' ' });

      // Save the changes
      await user.click(screen.getByText('actions.save'));

      // Error message should be displayed
      await waitFor(() => {
        expect(
          screen.getByText('properties.form.name.validation.required'),
        ).toBeInTheDocument();
      });
    });

    it('shows an error if the name conflicts with an existing property', async () => {
      const user = userEvent.setup();

      render(
        <DatabasePropertyEditor
          databaseId={DatabaseFixtures.objectDatabase.id}
          property={property}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(property.name));

      // Change the name to one that conflicts with an existing property
      await fillForm({ name: property2.name });

      // Save the changes
      await user.click(screen.getByText('actions.save'));

      // Error message should be displayed
      await waitFor(() => {
        expect(
          screen.getByText('properties.form.name.validation.nameConflict'),
        ).toBeInTheDocument();
      });
    });

    it('shows an error if the name contains invalid characters', async () => {
      const user = userEvent.setup();

      render(
        <DatabasePropertyEditor
          databaseId={DatabaseFixtures.objectDatabase.id}
          property={property}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(property.name));

      // Change the name to one with invalid characters
      await fillForm({ name: 'New name]' });

      // Save the changes
      await user.click(screen.getByText('actions.save'));

      // Error message should be displayed
      await waitFor(() => {
        expect(
          screen.getByText('properties.form.name.validation.invalidCharacters'),
        ).toBeInTheDocument();
      });
    });
  });
});
