import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, within } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseDefaultsSettings } from './DatabaseDefaultsSettings';

const {
  customContentType_file_1,
  customContentType_url_1,
  customContentTypes,
  objectDatabase,
  rootStorageDatabase,
  urlDatabase,
} = DatabaseFixtures;

/**
 * Returns the settings row titled by the given text.
 *
 * @param title - The row's title text.
 * @returns The settings row element.
 */
function settingRow(title: string): HTMLElement {
  return screen.getByText(title).closest('.setting') as HTMLElement;
}

/**
 * Returns the open custom content type form.
 *
 * @returns The form element.
 */
function customTypeForm(): HTMLElement {
  return screen
    .getByLabelText('Name')
    .closest('.custom-content-type-form') as HTMLElement;
}

/**
 * Opens the form for a new custom content type of the given kind.
 *
 * @param user - The user event instance.
 * @param kindLabel - The label of the kind's menu item.
 */
async function openNewCustomTypeForm(
  user: ReturnType<typeof userEvent.setup>,
  kindLabel: string,
): Promise<void> {
  // Open the add menu
  await user.click(
    screen.getByRole('button', { name: 'Add custom content type' }),
  );
  // Pick the kind's menu item by the start of its accessible name. The
  // name also includes the item's description.
  await user.click(
    screen.getByRole('menuitem', { name: new RegExp(`^${kindLabel}`) }),
  );
}

/**
 * Opens the edit form of the custom URL content type.
 *
 * @param user - The user event instance.
 */
async function openUrlTypeEditForm(
  user: ReturnType<typeof userEvent.setup>,
): Promise<void> {
  await user.click(
    within(settingRow(customContentType_url_1.name)).getByRole('button', {
      name: 'Edit content type',
    }),
  );
}

describe('<DatabaseDefaultsSettings />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the database for a content type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Pick the object database for text
    await user.click(within(settingRow('Text')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: objectDatabase.name }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ text: objectDatabase.id }),
    );
  });

  it('clears the database for a content type', async () => {
    const user = userEvent.setup();

    // Set a database for text
    Databases.setContentDefault('text', objectDatabase.id);

    render(<DatabaseDefaultsSettings />);

    // Pick none for text
    await user.click(within(settingRow('Text')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'None' }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ text: null }),
    );
  });

  it('lists only the databases which can hold the content type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open the text row's combobox
    await user.click(within(settingRow('Text')).getByRole('combobox'));

    expect(
      screen.getByRole('option', { name: objectDatabase.name }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: urlDatabase.name }),
    ).not.toBeInTheDocument();
  });

  it("lists a file content type's extensions", () => {
    render(<DatabaseDefaultsSettings />);

    expect(settingRow('PDFs')).toHaveTextContent('pdf');
  });

  it('creates a custom file content type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Fill in the form for a file type
    await openNewCustomTypeForm(user, 'File type');
    await user.type(screen.getByLabelText('Name'), 'Books');
    await user.type(screen.getByLabelText('File extensions'), 'epub,.MOBI,');
    await user.click(within(customTypeForm()).getByRole('combobox'));
    await user.click(
      screen.getByRole('option', { name: rootStorageDatabase.name }),
    );

    // Save the type
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [
          ...customContentTypes,
          expect.objectContaining({
            name: 'Books',
            kind: 'file',
            matchers: ['epub', 'mobi'],
            databaseId: rootStorageDatabase.id,
          }),
        ],
      }),
    );
  });

  it('creates a custom link content type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Fill in the form for a link type
    await openNewCustomTypeForm(user, 'Link type');
    await user.type(screen.getByLabelText('Name'), 'Encyclopedia');
    await user.type(screen.getByLabelText('Domains'), 'wikipedia.org{Enter}');

    // Save the type
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [
          ...customContentTypes,
          expect.objectContaining({
            name: 'Encyclopedia',
            kind: 'url',
            matchers: ['wikipedia.org'],
            databaseId: null,
          }),
        ],
      }),
    );
  });

  it('closes the form once the type is saved', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Fill in and save a link type
    await openNewCustomTypeForm(user, 'Link type');
    await user.type(screen.getByLabelText('Name'), 'Encyclopedia');
    await user.type(screen.getByLabelText('Domains'), 'wikipedia.org{Enter}');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(settingRow('Encyclopedia')).toHaveTextContent('wikipedia.org');
  });

  it('cancels adding a type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open and cancel the form
    await openNewCustomTypeForm(user, 'Link type');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ customTypes: customContentTypes }),
    );
  });

  it('disables saving until a name and a matcher are given', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open the form for a file type
    await openNewCustomTypeForm(user, 'File type');

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();

    // Fill in the name only
    await user.type(screen.getByLabelText('Name'), 'Books');

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it("rejects a built-in file content type's extension", async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Type an image extension
    await openNewCustomTypeForm(user, 'File type');
    await user.type(screen.getByLabelText('File extensions'), 'png{Enter}');

    expect(screen.getByText('Already used by Images')).toBeInTheDocument();
    expect(screen.getByLabelText('File extensions')).toHaveValue('png');
  });

  it('clears the matcher error once the matcher is edited', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Type an image extension, then edit it
    await openNewCustomTypeForm(user, 'File type');
    await user.type(screen.getByLabelText('File extensions'), 'png{Enter}');
    await user.type(screen.getByLabelText('File extensions'), 'x');

    expect(
      screen.queryByText('Already used by Images'),
    ).not.toBeInTheDocument();
  });

  it("rejects another custom content type's matcher", async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Type the domain the custom URL type lists
    await openNewCustomTypeForm(user, 'Link type');
    await user.type(
      screen.getByLabelText('Domains'),
      `${customContentType_url_1.matchers[0]}{Enter}`,
    );

    expect(
      screen.getByText(`Already used by ${customContentType_url_1.name}`),
    ).toBeInTheDocument();
  });

  it('sets the database for a custom content type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Pick the URL database for the custom URL type
    await user.click(
      within(settingRow(customContentType_url_1.name)).getByRole('combobox'),
    );
    await user.click(screen.getByRole('option', { name: urlDatabase.name }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [
          customContentType_file_1,
          { ...customContentType_url_1, databaseId: urlDatabase.id },
        ],
      }),
    );
  });

  it('edits a custom content type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open the type's form, rename it and add a domain
    await openUrlTypeEditForm(user);
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Repositories');
    await user.type(screen.getByLabelText('Domains'), 'bitbucket.org{Enter}');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [
          customContentType_file_1,
          {
            ...customContentType_url_1,
            name: 'Repositories',
            matchers: [...customContentType_url_1.matchers, 'bitbucket.org'],
          },
        ],
      }),
    );
  });

  it('cancels editing a type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open the type's form, rename it and cancel
    await openUrlTypeEditForm(user);
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Repositories');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ customTypes: customContentTypes }),
    );
  });

  it("accepts the edited type's own matchers", async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open the type's form and remove and re-add its domain
    await openUrlTypeEditForm(user);
    await user.click(
      screen.getByRole('button', {
        name: `Remove ${customContentType_url_1.matchers[0]}`,
      }),
    );
    await user.type(
      screen.getByLabelText('Domains'),
      `${customContentType_url_1.matchers[0]}{Enter}`,
    );

    expect(
      screen.queryByText(`Already used by ${customContentType_url_1.name}`),
    ).not.toBeInTheDocument();
  });

  it('deletes a custom content type from its form', async () => {
    const user = userEvent.setup();

    render(<DatabaseDefaultsSettings />);

    // Open the type's form and delete it
    await openUrlTypeEditForm(user);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(Databases.SettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ customTypes: [customContentType_file_1] }),
    );
  });
});
