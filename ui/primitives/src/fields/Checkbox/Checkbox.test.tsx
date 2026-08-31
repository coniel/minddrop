import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@minddrop/test-utils';
import { CheckboxField, CheckboxGroup } from './Checkbox';

// The group option values used by the tests
const OPTIONS = ['apple', 'banana', 'cherry'];

describe('<CheckboxGroup />', () => {
  afterEach(cleanup);

  it('checks a field when it is clicked', () => {
    render(<FruitGroup />);

    fireEvent.click(checkbox('Apple'));

    expect(checkbox('Apple')).toHaveAttribute('aria-checked', 'true');
    expect(checkbox('Banana')).toHaveAttribute('aria-checked', 'false');
  });

  it('unchecks a checked field when it is clicked again', () => {
    render(<FruitGroup />);

    fireEvent.click(checkbox('Apple'));
    fireEvent.click(checkbox('Apple'));

    expect(checkbox('Apple')).toHaveAttribute('aria-checked', 'false');
  });

  it('keeps other checked fields when one is unchecked', () => {
    render(<FruitGroup />);

    fireEvent.click(checkbox('Apple'));
    fireEvent.click(checkbox('Banana'));
    fireEvent.click(checkbox('Apple'));

    expect(checkbox('Banana')).toHaveAttribute('aria-checked', 'true');
  });

  it('checks all fields from the select-all checkbox', () => {
    render(<FruitGroup selectAll />);

    fireEvent.click(selectAllCheckbox());

    expect(checkbox('Apple')).toHaveAttribute('aria-checked', 'true');
    expect(checkbox('Banana')).toHaveAttribute('aria-checked', 'true');
    expect(checkbox('Cherry')).toHaveAttribute('aria-checked', 'true');
  });

  it('unchecks all fields when select-all is checked and clicked', () => {
    render(<FruitGroup selectAll />);

    fireEvent.click(selectAllCheckbox());
    fireEvent.click(selectAllCheckbox());

    expect(checkbox('Apple')).toHaveAttribute('aria-checked', 'false');
    expect(checkbox('Banana')).toHaveAttribute('aria-checked', 'false');
    expect(checkbox('Cherry')).toHaveAttribute('aria-checked', 'false');
  });

  it('marks select-all indeterminate when only some fields are checked', () => {
    render(<FruitGroup selectAll />);

    fireEvent.click(checkbox('Apple'));

    expect(selectAllCheckbox()).toHaveAttribute('aria-checked', 'mixed');
  });

  it('checks select-all once every field is checked individually', () => {
    render(<FruitGroup selectAll />);

    fireEvent.click(checkbox('Apple'));
    fireEvent.click(checkbox('Banana'));
    fireEvent.click(checkbox('Cherry'));

    expect(selectAllCheckbox()).toHaveAttribute('aria-checked', 'true');
  });

  it('fills in the remaining fields when indeterminate select-all is clicked', () => {
    render(<FruitGroup selectAll />);

    fireEvent.click(checkbox('Apple'));
    fireEvent.click(selectAllCheckbox());

    expect(checkbox('Banana')).toHaveAttribute('aria-checked', 'true');
    expect(checkbox('Cherry')).toHaveAttribute('aria-checked', 'true');
  });

  it('prevents toggling when the group is disabled', () => {
    render(<FruitGroup disabled />);

    fireEvent.click(checkbox('Apple'));

    expect(checkbox('Apple')).toHaveAttribute('aria-checked', 'false');
  });

  it('renders the group label', () => {
    render(<FruitGroup />);

    expect(screen.getByRole('group')).toHaveAccessibleName('Fruits');
  });
});

describe('<CheckboxField />', () => {
  afterEach(cleanup);

  it('toggles as a standalone controlled field', () => {
    render(<StandaloneField />);

    fireEvent.click(checkbox('Subscribed'));

    expect(checkbox('Subscribed')).toHaveAttribute('aria-checked', 'true');
  });

  it('supports a default checked state', () => {
    render(<CheckboxField stringLabel="Subscribed" defaultChecked />);

    expect(checkbox('Subscribed')).toHaveAttribute('aria-checked', 'true');
  });
});

/**
 * Returns the checkbox labelled by the given text.
 */
function checkbox(label: string): HTMLElement {
  return screen.getByRole('checkbox', { name: label });
}

/**
 * Returns the group's select-all checkbox.
 */
function selectAllCheckbox(): HTMLElement {
  return checkbox('Select all');
}

interface FruitGroupProps {
  selectAll?: boolean;
  disabled?: boolean;
}

/**
 * Renders a controlled checkbox group over the fruit options.
 */
const FruitGroup: React.FC<FruitGroupProps> = ({ selectAll, disabled }) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CheckboxGroup
      value={value}
      onChange={setValue}
      options={OPTIONS}
      selectAll={selectAll}
      disabled={disabled}
      stringLabel="Fruits"
    >
      <CheckboxField value="apple" stringLabel="Apple" />
      <CheckboxField value="banana" stringLabel="Banana" />
      <CheckboxField value="cherry" stringLabel="Cherry" />
    </CheckboxGroup>
  );
};

/**
 * Renders a controlled standalone checkbox field.
 */
const StandaloneField: React.FC = () => {
  const [checked, setChecked] = useState(false);

  return (
    <CheckboxField
      stringLabel="Subscribed"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
};
