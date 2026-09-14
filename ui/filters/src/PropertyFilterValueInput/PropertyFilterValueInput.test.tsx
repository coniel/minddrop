import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Filters, PropertyFilterValue } from '@minddrop/filters';
import { PropertySchema } from '@minddrop/properties';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { PropertyFilterValueInput } from './PropertyFilterValueInput';

const { tag_1 } = TagFixtures;

const statusProperty: PropertySchema = {
  type: 'select',
  name: 'Status',
  options: [
    { value: 'Todo', color: 'blue' },
    { value: 'Done', color: 'green' },
  ],
};

const countProperty: PropertySchema = { type: 'number', name: 'Count' };
const titleProperty: PropertySchema = { type: 'text', name: 'Title' };
const dueProperty: PropertySchema = { type: 'date', name: 'Due' };
const tagsProperty: PropertySchema = { type: 'tags', name: 'Tags' };

describe('<PropertyFilterValueInput />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders nothing for value-less operators', () => {
    const { container } = render(
      <PropertyFilterValueInput
        property={statusProperty}
        operator="is-empty"
        onChange={() => {}}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('reports the checked select options', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(statusProperty, 'is');

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Done' }));

    expect(reported.value).toEqual(['Done']);

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Todo' }));

    expect(reported.value).toEqual(['Done', 'Todo']);
  });

  it('picks from a combobox for long option lists', async () => {
    const user = userEvent.setup();
    const manyOptions: PropertySchema = {
      ...statusProperty,
      options: Array.from({ length: 11 }, (_, index) => ({
        value: `Option ${index + 1}`,
        color: 'blue' as const,
      })),
    };
    const reported = renderAndTrack(manyOptions, 'is');

    // Check a combobox renders in place of the checklist
    expect(screen.queryByRole('menuitemcheckbox')).toBeNull();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('Option 11'));

    expect(reported.value).toEqual(['Option 11']);
  });

  it('reports an unset value once every option is unchecked', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(statusProperty, 'is', ['Done']);

    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Done' }));

    expect(reported.value).toBeUndefined();
  });

  it('reports a typed number after a pause', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(countProperty, 'greater-than');

    await user.type(screen.getByRole('textbox'), '3');

    await waitFor(() => expect(reported.value).toBe(3));
  });

  it('reports typed text after a pause', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(titleProperty, 'contains');

    await user.type(screen.getByPlaceholderText('Value'), 'foo');

    await waitFor(() => expect(reported.value).toBe('foo'));
  });

  it('reports typed text right away on blur', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(titleProperty, 'contains');

    await user.type(screen.getByPlaceholderText('Value'), 'foo');
    await user.tab();

    expect(reported.value).toBe('foo');
  });

  it('reports a relative date preset', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(dueProperty, 'is');

    await user.click(screen.getByText('Value'));
    await user.click(screen.getByRole('option', { name: 'Today' }));

    expect(reported.value).toEqual({ type: 'relative', preset: 'today' });
  });

  it('defaults a day range to a week', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(dueProperty, 'is-after');

    await user.click(screen.getByText('Value'));
    await user.click(screen.getByRole('option', { name: 'Last N days' }));

    expect(reported.value).toEqual({
      type: 'relative-range',
      days: 7,
      direction: 'past',
    });
  });

  it('reports the picked items for collection properties', async () => {
    const user = userEvent.setup();
    const relatedProperty: PropertySchema = {
      type: 'collection',
      name: 'Related',
    };

    // Register an entity type with an item to pick
    Filters.registerAdapter({
      type: 'task',
      get: () => null,
      getAll: () => [{ id: 'task_1', title: 'Write tests' }],
      resolveValue: () => undefined,
      label: (item) => item.title,
    });

    const reported = renderAndTrack(relatedProperty, 'contains-any');

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText('Write tests'));

    expect(reported.value).toEqual(['task_1']);

    Filters.unregisterAdapter('task');
  });

  it('reports picked tags', async () => {
    const user = userEvent.setup();
    const reported = renderAndTrack(tagsProperty, 'contains-any');

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByText(tag_1.name));

    expect(reported.value).toEqual([tag_1.name]);
  });
});

interface TrackedInputProps {
  property: PropertySchema;
  operator: React.ComponentProps<typeof PropertyFilterValueInput>['operator'];
  initialValue?: PropertyFilterValue;
  reported: { value?: PropertyFilterValue };
}

/**
 * Renders the input with its value fed back, recording the last
 * reported value.
 */
function TrackedInput({
  property,
  operator,
  initialValue,
  reported,
}: TrackedInputProps) {
  const [value, setValue] = useState(initialValue);

  // Records the reported value and feeds it back
  function handleChange(newValue: PropertyFilterValue | undefined): void {
    reported.value = newValue;
    setValue(newValue);
  }

  return (
    <PropertyFilterValueInput
      property={property}
      operator={operator}
      value={value}
      onChange={handleChange}
    />
  );
}

/**
 * Renders the input and returns a holder of the last reported
 * value.
 */
function renderAndTrack(
  property: PropertySchema,
  operator: React.ComponentProps<typeof PropertyFilterValueInput>['operator'],
  value?: PropertyFilterValue,
) {
  const reported: { value?: PropertyFilterValue } = {};

  // Render the tracked input
  render(
    <TrackedInput
      property={property}
      operator={operator}
      initialValue={value}
      reported={reported}
    />,
  );

  return reported;
}
