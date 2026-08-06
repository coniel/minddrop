import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DatabaseFixtures,
  DatabaseUpdatedEvent,
  DatabaseUpdatedEventData,
  Databases,
} from '@minddrop/databases';
import { Events, OpenConfirmationDialogEvent } from '@minddrop/events';
import {
  fillForm,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { ConfirmationDialogProps } from '@minddrop/ui-primitives';
import { cleanup, setup } from '../test-utils';
import {
  DatabaseEntryTemplateEditor,
  DatabaseEntryTemplateEditorProps,
} from './DatabaseEntryTemplateEditor';

const { entryTemplatesDatabase, entryTemplate1, entryTemplate2 } =
  DatabaseFixtures;

describe('<DatabaseEntryTemplateEditor />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('formatted text properties', () => {
    // Adds a formatted text property to the fixture database and
    // opens the template's editor
    async function openEditorWithFormattedText(template = entryTemplate2) {
      const user = userEvent.setup();

      Databases.Store.update(entryTemplatesDatabase.id, {
        properties: [
          ...entryTemplatesDatabase.properties,
          { type: 'formatted-text', name: 'Summary' },
        ],
      });

      render(
        <DatabaseEntryTemplateEditor
          databaseId={entryTemplatesDatabase.id}
          template={template}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(template.name));

      return user;
    }

    it('are filled in with a rich text editor', async () => {
      await openEditorWithFormattedText();

      // A rich text editor is rendered rather than a plain input
      await waitFor(() => {
        expect(
          document.querySelector('[contenteditable="true"]'),
        ).not.toBeNull();
      });
    });

    it('are emptied by the clear button', async () => {
      // Open a template with a stored formatted text value
      const user = await openEditorWithFormattedText({
        ...entryTemplate2,
        properties: { Summary: 'Stored summary' },
      });

      // The stored value is shown in the editor
      await waitFor(() => {
        expect(document.body.textContent).toContain('Stored summary');
      });

      // Clear the property's value
      await user.click(screen.getByText('actions.clear'));

      // The editor no longer shows the cleared content
      await waitFor(() => {
        expect(document.body.textContent).not.toContain('Stored summary');
      });
    });

    it('discard their edits when the editor is cancelled', async () => {
      const user = await openEditorWithFormattedText();

      const editable = await waitFor(() => {
        const node = document.querySelector('[contenteditable="true"]');

        expect(node).not.toBeNull();

        return node as HTMLElement;
      });

      // Type into the editor
      await user.click(editable);
      await user.keyboard('Typed content');

      await waitFor(() => {
        expect(document.body.textContent).toContain('Typed content');
      });

      // Cancel, then reopen the editor
      await user.click(screen.getByText('actions.cancel'));
      await user.click(screen.getByText(entryTemplate2.name));

      // The cancelled edits are gone
      await waitFor(() => {
        expect(document.body.textContent).not.toContain('Typed content');
      });
    });
  });

  describe('existing template', () => {
    async function renameTemplate() {
      const user = userEvent.setup();

      render(
        <DatabaseEntryTemplateEditor
          databaseId={entryTemplatesDatabase.id}
          template={entryTemplate1}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(entryTemplate1.name));

      // Change the name
      await fillForm({ name: 'Renamed Template' });

      // Save the changes
      await user.click(screen.getByText('actions.save'));
    }

    it('updates the template on save', () =>
      new Promise<void>((done) => {
        // Listen for database updates and verify the template was updated
        Events.addListener<DatabaseUpdatedEventData>(
          DatabaseUpdatedEvent,
          'test',
          ({ data }) => {
            expect(
              data.updated.entryTemplates?.find(
                (template) => template.id === entryTemplate1.id,
              )?.name,
            ).toBe('Renamed Template');
            done();
          },
        );

        renameTemplate();
      }));

    it('closes the editor on successful save', async () => {
      await renameTemplate();

      // Editor form should be closed
      await waitFor(() => {
        expect(screen.getByText('actions.save')).not.toBeVisible();
      });
    });

    describe('deleting', () => {
      async function clickDeleteTemplate(template = entryTemplate1) {
        const user = userEvent.setup();

        render(
          <DatabaseEntryTemplateEditor
            databaseId={entryTemplatesDatabase.id}
            template={template}
          />,
        );

        // Open the editor
        await user.click(screen.getByText(template.name));

        // Delete the template
        await user.click(screen.getByText('actions.delete'));
      }

      it('mentions stored files when the template has some', () =>
        new Promise<void>((done) => {
          Events.addListener<ConfirmationDialogProps>(
            OpenConfirmationDialogEvent,
            'test',
            ({ data }) => {
              // entryTemplate1 has an image value, so a file is stored
              expect(data.message).toBe(
                'databases.entryTemplates.actions.delete.confirmation.messageWithFiles',
              );
              done();
            },
          );

          clickDeleteTemplate();
        }));

      it('omits stored files when the template has none', () =>
        new Promise<void>((done) => {
          Events.addListener<ConfirmationDialogProps>(
            OpenConfirmationDialogEvent,
            'test',
            ({ data }) => {
              // entryTemplate2 has no property values, so no files
              expect(data.message).toBe(
                'databases.entryTemplates.actions.delete.confirmation.message',
              );
              done();
            },
          );

          clickDeleteTemplate(entryTemplate2);
        }));

      it('confirms before deleting the template', () =>
        new Promise<void>((done) => {
          // Listen for the confirmation dialog event
          Events.addListener<ConfirmationDialogProps>(
            OpenConfirmationDialogEvent,
            'test',
            ({ data }) => {
              // Confirm the delete action
              data.onConfirm();
            },
          );

          // Listen for database updates and verify the template was removed
          Events.addListener<DatabaseUpdatedEventData>(
            DatabaseUpdatedEvent,
            'test',
            ({ data }) => {
              expect(
                data.updated.entryTemplates?.find(
                  (template) => template.id === entryTemplate1.id,
                ),
              ).toBeUndefined();
              done();
            },
          );

          clickDeleteTemplate();
        }));
    });
  });

  describe('draft template', () => {
    function renderDraftEditor(
      props: Partial<DatabaseEntryTemplateEditorProps> = {},
    ) {
      render(
        <DatabaseEntryTemplateEditor
          isDraft
          databaseId={entryTemplatesDatabase.id}
          template={{
            id: 'database-entry-template_draft',
            name: '',
            properties: {},
          }}
          {...props}
        />,
      );
    }

    async function saveDraftTemplate(
      props: Partial<DatabaseEntryTemplateEditorProps> = {},
    ) {
      const user = userEvent.setup();

      renderDraftEditor(props);

      // Drafts start without a name, which is required
      await fillForm({ name: 'New template' });

      // Save the new template
      await user.click(screen.getByText('actions.save'));
    }

    it('focuses the name field when the template has no name', async () => {
      renderDraftEditor();

      // The name field should be focused, ready to be filled in
      await waitFor(() => {
        expect(
          screen.getByLabelText('databases.entryTemplates.form.name.label'),
        ).toHaveFocus();
      });
    });

    it('opens the editor by default', () => {
      renderDraftEditor();

      // Editor form should be open
      expect(screen.getByText('actions.save')).toBeVisible();
    });

    it('adds the template on save', () =>
      new Promise<void>((done) => {
        // Listen for database updates and verify the template was added
        Events.addListener<DatabaseUpdatedEventData>(
          DatabaseUpdatedEvent,
          'test',
          ({ data }) => {
            expect(
              data.updated.entryTemplates?.find(
                (template) => template.name === 'New template',
              ),
            ).toBeDefined();
            done();
          },
        );

        saveDraftTemplate();
      }));

    it('calls onSaveDraft callback after saving', async () => {
      const onSaveDraft = vi.fn();

      await saveDraftTemplate({ onSaveDraft });

      await waitFor(() => {
        expect(onSaveDraft).toHaveBeenCalledWith();
      });
    });

    it('calls onCancelDraft callback on cancel', async () => {
      const onCancelDraft = vi.fn();
      const user = userEvent.setup();

      renderDraftEditor({ onCancelDraft });

      // Cancel the new template creation
      await user.click(screen.getByText('actions.cancel'));

      expect(onCancelDraft).toHaveBeenCalledWith();
    });
  });

  describe('validation', () => {
    it('shows an error if the name is empty', async () => {
      const user = userEvent.setup();

      render(
        <DatabaseEntryTemplateEditor
          databaseId={entryTemplatesDatabase.id}
          template={entryTemplate1}
        />,
      );

      // Open the editor
      await user.click(screen.getByText(entryTemplate1.name));

      // Set the name to just a space
      await fillForm({ name: ' ' });

      // Save the changes
      await user.click(screen.getByText('actions.save'));

      // Error message should be displayed
      await waitFor(() => {
        expect(
          screen.getByText(
            'databases.entryTemplates.form.name.validation.required',
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
