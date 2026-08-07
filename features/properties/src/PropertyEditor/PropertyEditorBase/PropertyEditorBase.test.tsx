import { afterEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { PropertySchema, TextPropertySchema } from '@minddrop/properties';
import {
  cleanup,
  emojiIconString,
  fillForm,
  fireEvent,
  pickEmojiIcon,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { PropertyEditorBase } from './PropertyEditorBase';

const onSave = vi.fn();
const onDelete = vi.fn();

// The editor renders concrete properties, whose names are user-facing text
// rather than i18n keys. The schema is a template, so translate its name.
const textProperty: PropertySchema = {
  ...TextPropertySchema,
  name: i18n.t(TextPropertySchema.name),
};

describe('<PropertyEditorBase />', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('focuses and selects name input when opened with default name', async () => {
    const defaultName = i18n.t(TextPropertySchema.name);

    render(
      <PropertyEditorBase
        defaultOpen
        property={{ ...TextPropertySchema, name: defaultName }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  it('does not focus name input when opened with custom name', () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={{ ...TextPropertySchema, name: 'My Property' }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole('textbox')).not.toHaveFocus();
  });

  it('focuses name input when editor is opened via click with default name', async () => {
    const defaultName = i18n.t(TextPropertySchema.name);

    render(
      <PropertyEditorBase
        property={{ ...TextPropertySchema, name: defaultName }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText(defaultName));

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  it('opens property form on click', async () => {
    render(
      <PropertyEditorBase
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText(textProperty.name));

    expect(screen.getByText(textProperty.name)).not.toBeVisible();
    expect(screen.getByRole('textbox')).toBeVisible();
  });

  it('renders open when defaultOpen is true', () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText(textProperty.name)).not.toBeVisible();
    expect(screen.getByRole('textbox')).toBeVisible();
  });

  it('populates form with property values', () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveValue(textProperty.name);
  });

  it('renders delete button when deletable is true', () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        deletable
      />,
    );

    expect(screen.getByText('actions.delete')).toBeVisible();
  });

  it('does not render delete button when deletable is false', () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        deletable={false}
      />,
    );

    expect(screen.queryByText('actions.delete')).not.toBeInTheDocument();
  });

  it('calls onSave with updated property on save', async () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await fillForm({ name: 'New name' });
    await pickEmojiIcon('properties.form.icon.label');
    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith({
      ...textProperty,
      name: 'New name',
      icon: emojiIconString,
    });
  });

  it('calls onCancel on cancel', async () => {
    const onCancel = vi.fn();

    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        onCancel={onCancel}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.cancel'));

    expect(onCancel).toHaveBeenCalled();
  });

  it('closes form on true save result', async () => {
    const onSaveAsync = async () =>
      new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 200));

    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSaveAsync}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.save'));

    await waitFor(() => {
      expect(screen.getByText(textProperty.name)).toBeVisible();
      expect(screen.queryByRole('textbox', { hidden: true })).not.toBeVisible();
    });
  });

  it('keeps form open on false save result', async () => {
    const onSaveAsync = async () =>
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 200));

    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSaveAsync}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.save'));

    await waitFor(() => {
      expect(screen.queryByText(textProperty.name)).not.toBeVisible();
      expect(screen.getByRole('textbox')).toBeVisible();
    });
  });

  it('calls onDelete with property on delete', async () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.delete'));

    expect(onDelete).toHaveBeenCalledWith(textProperty);
  });

  it('resets form values on cancel', async () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await fillForm({ name: 'New name' });
    await pickEmojiIcon('properties.form.icon.label');
    await user.click(screen.getByText('actions.cancel'));

    // Re-open editor
    await user.click(screen.getByText(textProperty.name));

    // Save without making changes
    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith(textProperty);
  });

  it('calls onNameEnter when Enter is pressed in the name field', async () => {
    const onNameEnter = vi.fn();

    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        onNameEnter={onNameEnter}
      />,
    );

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });

    expect(onNameEnter).toHaveBeenCalled();
  });

  it('shows name hint when name field is focused and nameEnterHint is set', async () => {
    render(
      <PropertyEditorBase
        defaultOpen
        // A custom name so the editor does not auto-focus the name field
        property={{ ...textProperty, name: 'My Property' }}
        onSave={onSave}
        onDelete={onDelete}
        onNameEnter={vi.fn()}
        nameEnterHint="properties.select.options.nameEnterHint"
      />,
    );
    const user = userEvent.setup();

    expect(
      screen.queryByText('properties.select.options.nameEnterHint'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('textbox'));

    expect(
      screen.getByText('properties.select.options.nameEnterHint'),
    ).toBeVisible();
  });

  it('hides name hint when name field loses focus', async () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        onNameEnter={vi.fn()}
        nameEnterHint="properties.select.options.nameEnterHint"
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('textbox'));

    expect(
      screen.getByText('properties.select.options.nameEnterHint'),
    ).toBeVisible();

    fireEvent.blur(screen.getByRole('textbox'));

    expect(
      screen.queryByText('properties.select.options.nameEnterHint'),
    ).not.toBeInTheDocument();
  });

  it('hides name hint when field has an error', async () => {
    const nameValidator = vi.fn((value: string) => {
      if (value.length < 5) {
        return 'properties.form.name.validation.required';
      }
    });

    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        onNameEnter={vi.fn()}
        nameEnterHint="properties.select.options.nameEnterHint"
        validators={{ name: nameValidator }}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('textbox'));
    await fillForm({ name: 'abc' });
    fireEvent.blur(screen.getByRole('textbox'));

    await user.click(screen.getByRole('textbox'));

    expect(
      screen.queryByText('properties.select.options.nameEnterHint'),
    ).not.toBeInTheDocument();
  });

  it('does not show hint when nameEnterHint is not set', async () => {
    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('textbox'));

    expect(
      screen.queryByText('properties.select.options.nameEnterHint'),
    ).not.toBeInTheDocument();
  });

  it('validates name field', async () => {
    const nameValidator = vi.fn((value: string) => {
      if (value.length < 5) {
        return 'properties.form.name.validation.required';
      }
    });

    render(
      <PropertyEditorBase
        defaultOpen
        property={textProperty}
        onSave={onSave}
        onDelete={onDelete}
        validators={{ name: nameValidator }}
      />,
    );
    const user = userEvent.setup();

    await fillForm({ name: 'abc' });
    await user.click(screen.getByText('actions.save'));

    expect(
      await screen.findByText('properties.form.name.validation.required'),
    ).toBeVisible();

    await fillForm({ name: 'Valid Name' });
    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith({
      ...textProperty,
      name: 'Valid Name',
    });
  });
});
