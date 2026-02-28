import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectPropertySchema } from '@minddrop/properties';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { SelectPropertyEditor } from './SelectPropertyEditor';

const onSave = vi.fn();
const onDelete = vi.fn();

const property: SelectPropertySchema = {
  ...SelectPropertySchema,
  name: 'Status',
  options: [
    { value: 'To do', color: 'blue' },
    { value: 'In progress', color: 'yellow' },
  ],
};

describe('<SelectPropertyEditor />', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('adds an empty option when opened with no options (defaultOpen)', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={{ ...SelectPropertySchema, name: 'Status', options: [] }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getAllByPlaceholderText('properties.select.options.placeholder'),
      ).toHaveLength(1);
    });
  });

  it('focuses the new option when opened with no options (defaultOpen)', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={{ ...SelectPropertySchema, name: 'Status', options: [] }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('properties.select.options.placeholder'),
      ).toHaveFocus();
    });
  });

  it('does not add an option when opened with default name (focuses name field instead)', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={{ ...SelectPropertySchema, name: 'Select', options: [] }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    await waitFor(() => {
      expect(
        screen.queryByPlaceholderText('properties.select.options.placeholder'),
      ).not.toBeInTheDocument();
    });
  });

  it('adds an empty option when opened via click with no options', async () => {
    render(
      <SelectPropertyEditor
        deletable={false}
        property={{ ...SelectPropertySchema, name: 'Status', options: [] }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('Status'));

    expect(
      screen.getAllByPlaceholderText('properties.select.options.placeholder'),
    ).toHaveLength(1);
  });

  it('renders existing options', () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByDisplayValue('To do')).toBeVisible();
    expect(screen.getByDisplayValue('In progress')).toBeVisible();
  });

  it('adds a new option when add button is clicked', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('properties.select.options.add'));

    expect(
      screen.getAllByPlaceholderText('properties.select.options.placeholder'),
    ).toHaveLength(3);
  });

  it('adds a new option when Enter is pressed in an option input', () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    fireEvent.keyDown(screen.getByDisplayValue('To do'), { key: 'Enter' });

    expect(
      screen.getAllByPlaceholderText('properties.select.options.placeholder'),
    ).toHaveLength(3);
  });

  it('blurs the option input when Escape is pressed', () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    const input = screen.getByDisplayValue('To do');

    // Focus the input
    fireEvent.focus(input);

    // Press Escape
    fireEvent.keyDown(input, { key: 'Escape' });

    // Input should no longer have focus
    expect(input).not.toHaveFocus();
  });

  it('removes an empty option when Escape is pressed', () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={{
          ...property,
          options: [...property.options, { value: '', color: 'green' }],
        }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );

    // There should be 3 option rows (2 existing + 1 empty)
    const inputs = screen.getAllByPlaceholderText(
      'properties.select.options.placeholder',
    );

    expect(inputs).toHaveLength(3);

    // Press Escape on the empty option
    fireEvent.keyDown(inputs[2], { key: 'Escape' });

    // The empty option should be removed
    expect(
      screen.getAllByPlaceholderText('properties.select.options.placeholder'),
    ).toHaveLength(2);
  });

  it('deletes an option when its delete button is clicked', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

    await user.click(deleteButtons[0]);

    expect(screen.queryByDisplayValue('To do')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('In progress')).toBeVisible();
  });

  it('shows shortcut hint when an option input is focused', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    expect(
      screen.queryByText('properties.select.options.addHint'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByDisplayValue('To do'));

    expect(screen.getByText('properties.select.options.addHint')).toBeVisible();
  });

  it('hides shortcut hint when focus leaves the options', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByDisplayValue('To do'));

    expect(screen.getByText('properties.select.options.addHint')).toBeVisible();

    // Blur the focused input
    fireEvent.blur(screen.getByDisplayValue('To do'));

    expect(
      screen.queryByText('properties.select.options.addHint'),
    ).not.toBeInTheDocument();
  });

  it('calls onSave with options', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ options: property.options }),
    );
  });

  it('filters out empty options on save', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText('properties.select.options.add'));
    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ options: property.options }),
    );
  });

  it('saves multiselect state', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('switch'));
    await user.click(screen.getByText('actions.save'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ multiselect: true }),
    );
  });

  it('focuses the first empty option when Enter is pressed in the name field', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={{
          ...property,
          options: [{ value: '', color: 'blue' }, ...property.options],
        }}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByDisplayValue('Status'));
    fireEvent.keyDown(screen.getByDisplayValue('Status'), { key: 'Enter' });

    await waitFor(() => {
      expect(
        screen.getAllByPlaceholderText(
          'properties.select.options.placeholder',
        )[0],
      ).toHaveFocus();
    });
  });

  it('adds a new option when Enter is pressed in the name field with no empty options', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    await user.click(screen.getByDisplayValue('Status'));
    fireEvent.keyDown(screen.getByDisplayValue('Status'), { key: 'Enter' });

    expect(
      screen.getAllByPlaceholderText('properties.select.options.placeholder'),
    ).toHaveLength(3);
  });

  it('shows name enter hint when name field is focused', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    expect(
      screen.queryByText('properties.select.options.nameEnterHint'),
    ).not.toBeInTheDocument();

    await user.click(screen.getByDisplayValue('Status'));

    expect(
      screen.getByText('properties.select.options.nameEnterHint'),
    ).toBeVisible();
  });

  it('resets options on cancel', async () => {
    render(
      <SelectPropertyEditor
        defaultOpen
        deletable={false}
        property={property}
        onSave={onSave}
        onDelete={onDelete}
      />,
    );
    const user = userEvent.setup();

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });

    await user.click(deleteButtons[0]);
    await user.click(screen.getByText('actions.cancel'));

    // Re-open editor
    await user.click(screen.getByText('Status'));

    expect(screen.getByDisplayValue('To do')).toBeVisible();
    expect(screen.getByDisplayValue('In progress')).toBeVisible();
  });
});
