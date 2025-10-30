import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FileBaseItemTypeConfig,
  PdfBaseItemTypeConfig,
  UrlBaseItemTypeConfig,
} from '@minddrop/base-item-types';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { ItemTypeConfig, ItemTypes } from '@minddrop/item-types';
import { fillForm, render, userEvent, waitFor } from '@minddrop/test-utils';
import { OpenNewItemTypeDialogEvent } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { NewItemTypeDialog } from './NewItemTypeDialog';

const emojiIcon = '😀';
const iconString = `emoji:${emojiIcon}:1`;
const nameSingular = 'Test Item';
const namePlural = 'Test Items';

interface FormOptions {
  baseTypeName: string;
  nameSingular: string;
  namePlural: string;
}

const defultFormOptions: FormOptions = {
  namePlural: namePlural,
  nameSingular: nameSingular,
  baseTypeName: UrlBaseItemTypeConfig.name,
};

async function pickIcon(rendered: ReturnType<typeof render>) {
  const user = userEvent.setup();
  const { getByText, getByLabelText } = rendered;

  // Open icon picker
  await user.click(getByLabelText('Select icon'));

  // Wait for icon picker to open
  await waitFor(() => {
    getByText('emojiPicker.label');
  });

  // Select an emoji
  await user.click(getByText('emojiPicker.label'));

  await waitFor(() => {
    getByText('Smileys & Emotion');
  });

  await user.click(getByText(emojiIcon));
}

async function submitNewItemTypeForm(options: FormOptions = defultFormOptions) {
  const rendered = render(<NewItemTypeDialog defaultOpen />);
  const user = userEvent.setup();
  const { getByText } = rendered;

  // Pick icon
  await pickIcon(rendered);

  // Fill out names
  await fillForm({
    nameSingular: options.nameSingular,
    namePlural: options.namePlural,
  });

  // Pick URL base type
  await user.click(getByText(options.baseTypeName));

  // Submit the form
  await user.click(getByText('itemTypes.form.actions.create'));

  return rendered;
}

describe('<NewItemTypeDialog />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('opens on open event', async () => {
    const { getByText } = render(<NewItemTypeDialog />);

    Events.dispatch(OpenNewItemTypeDialogEvent);

    await waitFor(() => {
      getByText('itemTypes.form.labels.new');
    });
  });

  it('closes on cancel', async () => {
    const { getByText, queryByText } = render(
      <NewItemTypeDialog defaultOpen />,
    );
    const user = userEvent.setup();

    // Click the cancel button
    await user.click(getByText('actions.cancel'));

    await waitFor(() => {
      expect(queryByText('itemTypes.form.labels.new')).toBeNull();
    });
  });

  it('creates a new item type with all provided properties', () =>
    new Promise<void>((resolve) => {
      // Listen for the item type creation event
      Events.addListener<ItemTypeConfig>(
        'item-types:item-type:create',
        'test',
        ({ data: itemType }) => {
          expect(itemType.nameSingular).toBe(nameSingular);
          expect(itemType.namePlural).toBe(namePlural);
          expect(itemType.baseType).toBe(UrlBaseItemTypeConfig.type);
          expect(itemType.dataType).toBe(UrlBaseItemTypeConfig.dataType);
          expect(itemType.icon).toBe(iconString);
          resolve();
        },
      );

      // Fill and submit the new item type form
      submitNewItemTypeForm();
    }));

  it('allows specifying a file base type', () =>
    new Promise<void>((resolve) => {
      // Listen for the item type creation event
      Events.addListener<ItemTypeConfig>(
        'item-types:item-type:create',
        'test',
        ({ data: itemType }) => {
          expect(itemType.baseType).toBe(PdfBaseItemTypeConfig.type);
          expect(itemType.dataType).toBe(PdfBaseItemTypeConfig.dataType);
          resolve();
        },
      );

      async function fillAndSubmitForm() {
        const { getByText } = render(<NewItemTypeDialog defaultOpen />);
        const user = userEvent.setup();

        // Fill out names
        await fillForm({
          nameSingular,
          namePlural,
        });

        // Pick File base type
        await user.click(getByText(FileBaseItemTypeConfig.name));
        // Pick PDF base file type
        await user.click(getByText(PdfBaseItemTypeConfig.name));

        // Submit the form
        await user.click(getByText('itemTypes.form.actions.create'));
      }

      fillAndSubmitForm();
    }));

  describe('nameSingular validation', () => {
    it('requires a nameSingular', async () => {
      const { getByText } = await submitNewItemTypeForm({
        ...defultFormOptions,
        nameSingular: '',
      });

      await waitFor(() => {
        getByText('formErrors.required');
      });
    });

    it('requires a unique nameSingular', async () => {
      // Add an existing item type to test against
      await ItemTypes.create({
        baseType: UrlBaseItemTypeConfig.type,
        dataType: UrlBaseItemTypeConfig.dataType,
        nameSingular,
        namePlural: 'Some Items',
        icon: iconString,
        color: 'gray',
      });

      const { getByText } = await submitNewItemTypeForm();

      await waitFor(() => {
        getByText(i18n.t('itemTypes.form.errors.itemNameConflict'));
      });
    });
  });

  describe('namePlural validation', () => {
    it('requires a namePlural', async () => {
      const { getByText } = await submitNewItemTypeForm({
        ...defultFormOptions,
        namePlural: '',
      });

      await waitFor(() => {
        getByText('formErrors.required');
      });
    });

    it('requires a unique namePlural', async () => {
      // Add an existing item type to test against
      await ItemTypes.create({
        baseType: UrlBaseItemTypeConfig.type,
        dataType: UrlBaseItemTypeConfig.dataType,
        nameSingular: 'Some Item',
        namePlural,
        icon: iconString,
        color: 'gray',
      });

      const { getByText } = await submitNewItemTypeForm();

      await waitFor(() => {
        getByText(i18n.t('itemTypes.form.errors.typeNameConflict'));
      });
    });

    it('ensures there is no directory path conflict', async () => {
      // Create a directory that conflicts with the item type path
      MockFs.createDir(ItemTypes.dirPath(namePlural));

      const { getByText } = await submitNewItemTypeForm({
        ...defultFormOptions,
        namePlural,
      });

      await waitFor(() => {
        getByText(i18n.t('itemTypes.form.errors.pathConflict'));
      });
    });
  });

  describe('default icon', () => {
    it('sets the base type icon as the default', () =>
      new Promise<void>((resolve) => {
        // Listen for the item type creation event
        Events.addListener<ItemTypeConfig>(
          'item-types:item-type:create',
          'test',
          ({ data: itemType }) => {
            expect(itemType.icon).toBe(UrlBaseItemTypeConfig.icon);
            resolve();
          },
        );

        async function fillAndSubmitForm() {
          const { getByText } = render(<NewItemTypeDialog defaultOpen />);
          const user = userEvent.setup();

          // Fill out names
          await fillForm({
            nameSingular,
            namePlural,
          });

          // Pick URL base type
          await user.click(getByText(UrlBaseItemTypeConfig.name));

          // Submit the form
          await user.click(getByText('itemTypes.form.actions.create'));
        }

        fillAndSubmitForm();
      }));

    it('preserves user selected icon when base type changes', () =>
      new Promise<void>((resolve) => {
        // Listen for the item type creation event
        Events.addListener<ItemTypeConfig>(
          'item-types:item-type:create',
          'test',
          ({ data: itemType }) => {
            expect(itemType.icon).toBe(iconString);
            resolve();
          },
        );

        async function fillAndSubmitForm() {
          const rendered = render(<NewItemTypeDialog defaultOpen />);
          const user = userEvent.setup();
          const { getByText } = rendered;

          // Pick icon
          await pickIcon(rendered);

          // Fill out names
          await fillForm({
            nameSingular,
            namePlural,
          });

          // Pick URL base type
          await user.click(getByText(UrlBaseItemTypeConfig.name));

          // Submit the form
          await user.click(getByText('itemTypes.form.actions.create'));
        }

        fillAndSubmitForm();
      }));

    describe('file type icon', () => {
      it('sets the file type icon as the default', () =>
        new Promise<void>((resolve) => {
          // Listen for the item type creation event
          Events.addListener<ItemTypeConfig>(
            'item-types:item-type:create',
            'test',
            ({ data: itemType }) => {
              expect(itemType.icon).toBe(PdfBaseItemTypeConfig.icon);
              resolve();
            },
          );

          async function fillAndSubmitForm() {
            const { getByText } = render(<NewItemTypeDialog defaultOpen />);
            const user = userEvent.setup();

            // Fill out names
            await fillForm({
              nameSingular,
              namePlural,
            });

            // Pick File base type
            await user.click(getByText(FileBaseItemTypeConfig.name));
            // Pick PDF base file type
            await user.click(getByText(PdfBaseItemTypeConfig.name));

            // Submit the form
            await user.click(getByText('itemTypes.form.actions.create'));
          }

          fillAndSubmitForm();
        }));

      it('preserves user selected icon when base type changes', () =>
        new Promise<void>((resolve) => {
          // Listen for the item type creation event
          Events.addListener<ItemTypeConfig>(
            'item-types:item-type:create',
            'test',
            ({ data: itemType }) => {
              expect(itemType.icon).toBe(iconString);
              resolve();
            },
          );

          async function fillAndSubmitForm() {
            const rendered = render(<NewItemTypeDialog defaultOpen />);
            const user = userEvent.setup();
            const { getByText } = rendered;

            // Pick icon
            await pickIcon(rendered);

            // Fill out names
            await fillForm({
              nameSingular,
              namePlural,
            });

            // Pick File base type
            await user.click(getByText(FileBaseItemTypeConfig.name));
            // Pick PDF base file type
            await user.click(getByText(PdfBaseItemTypeConfig.name));

            // Submit the form
            await user.click(getByText('itemTypes.form.actions.create'));
          }

          fillAndSubmitForm();
        }));
    });
  });
});
