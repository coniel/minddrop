import { afterEach, describe, expect, it, vi } from 'vitest';
import { TextPropertySchema } from '@minddrop/properties';
import {
  cleanup,
  emojiIconString,
  fillForm,
  pickEmojiIcon,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { PropertyEditor } from './PropertyEditor';

const onSave = vi.fn();
const onDelete = vi.fn();

describe('<PropertyEditor />', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('opens property form on click', async () => {
    render(
      <PropertyEditor
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    // Click to open editor
    await user.click(screen.getByText(TextPropertySchema.name));

    // Should no longer render name
    expect(screen.getByText(TextPropertySchema.name)).not.toBeVisible();
    // Should render property form
    expect(screen.getByLabelText('properties.form.name.label')).toBeVisible();
  });

  it('renders open property form when defaultOpen is true', () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    // Should not render name
    expect(screen.getByText(TextPropertySchema.name)).not.toBeVisible();
    // Should render property form
    expect(screen.getByLabelText('properties.form.name.label')).toBeVisible();
  });

  it('renders property form with values', () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    expect(
      screen.getByLabelText('properties.form.name.label').getAttribute('value'),
    ).toBe(TextPropertySchema.name);
  });

  it('renders delete button when deletable is true', () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
        deletable
      />,
    );

    expect(screen.getByText('properties.actions.delete.label')).toBeVisible();
  });

  it('does not render delete button when deletable is false', () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
        deletable={false}
      />,
    );

    expect(
      screen.queryByText('properties.actions.delete.label'),
    ).not.toBeInTheDocument();
  });

  it('calls onSave with updated property on save', async () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await fillForm({
      name: 'New name',
    });

    await pickEmojiIcon('properties.form.icon.label');

    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith({
      ...TextPropertySchema,
      name: 'New name',
      icon: emojiIconString,
    });
  });

  it('calls onCancel on cancel', async () => {
    const onCancel = vi.fn();

    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
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
    const onSaveAsync = async () => {
      // Simulate save delay
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(true), 200),
      );
    };

    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSaveAsync}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.save'));

    await waitFor(() => {
      // Should render property name
      expect(screen.getByText(TextPropertySchema.name)).toBeVisible();
      // Should not render property form
      expect(
        screen.queryByLabelText('properties.form.name.label'),
      ).not.toBeVisible();
    });
  });

  it('keeps form open on false save result', async () => {
    const onSaveAsync = async () => {
      // Simulate save delay
      return new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), 200),
      );
    };

    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSaveAsync}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.save'));

    await waitFor(() => {
      // Should not render property name
      expect(screen.queryByText(TextPropertySchema.name)).not.toBeVisible();
      // Should render property form
      expect(screen.getByLabelText('properties.form.name.label')).toBeVisible();
    });
  });

  it('calls onDelete with property on delete', async () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('properties.actions.delete.label'));

    expect(onDelete).toHaveBeenCalledWith(TextPropertySchema);
  });

  it('resets form values on cancel', async () => {
    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await fillForm({
      name: 'New name',
    });

    await pickEmojiIcon('properties.form.icon.label');

    await user.click(screen.getByText('actions.cancel'));

    // Re-open editor
    await user.click(screen.getByText(TextPropertySchema.name));

    // Save without making changes
    await user.click(screen.getByText('actions.save'));

    // onSave should be called with original property values
    expect(onSave).toHaveBeenCalledWith(TextPropertySchema);
  });

  it('validates name field', async () => {
    const nameValidator = vi.fn((value: string) => {
      if (value.length < 5) {
        return 'Name error';
      }
    });

    render(
      <PropertyEditor
        defaultOpen
        property={TextPropertySchema}
        onSave={onSave}
        onDelete={onDelete}
        validators={{ name: nameValidator }}
      />,
    );
    const user = userEvent.setup();

    // Enter invalid name
    await fillForm({
      name: 'abc',
    });

    // Save to trigger validation
    await user.click(screen.getByText('actions.save'));

    // Expect validation error message
    expect(await screen.findByText('Name error')).toBeVisible();

    // Enter valid name
    await fillForm({
      name: 'Valid Name',
    });

    // Save again
    await user.click(screen.getByText('actions.save'));

    // onSave should be called
    expect(onSave).toHaveBeenCalledWith({
      ...TextPropertySchema,
      name: 'Valid Name',
    });
  });
});
