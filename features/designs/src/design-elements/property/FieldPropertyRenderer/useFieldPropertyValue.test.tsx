import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyMap, PropertyValue } from '@minddrop/properties';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
} from '@minddrop/test-utils';
import {
  DesignPropertiesProvider,
  useElementProperty,
} from '../../../DesignPropertiesProvider';
import { cleanup, setup } from '../../../test-utils';
import { useFieldPropertyValue } from './useFieldPropertyValue';

// The element whose binding the harness reads
const ElementId = 'field-element';

// The bound property and its stored value
const PropertyName = 'Subtitle';
const StoredValue = 'Stored value';

// Property updates committed through the provider, reset per test
let committedValues: PropertyMap;

describe('useFieldPropertyValue', () => {
  beforeEach(() => {
    setup();

    committedValues = {};
  });

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  it('displays the stored property value at rest', () => {
    renderField();

    expect(screen.getByRole('textbox')).toHaveValue(StoredValue);
  });

  it('stages typed drafts without persisting them', async () => {
    renderField();

    await userEvent.type(screen.getByRole('textbox'), '!');

    // The field shows the draft while nothing has been committed
    expect(screen.getByRole('textbox')).toHaveValue(`${StoredValue}!`);
    expect(committedValues).toEqual({});
  });

  it('commits the draft to the property on leave', async () => {
    renderField();

    await userEvent.type(screen.getByRole('textbox'), '!');
    await userEvent.tab();

    expect(committedValues[PropertyName]).toBe(`${StoredValue}!`);
  });

  it('skips committing unchanged drafts', async () => {
    renderField();

    // Type a character and delete it again, leaving the stored
    // value as the draft
    await userEvent.type(screen.getByRole('textbox'), '!{backspace}');
    await userEvent.tab();

    expect(committedValues).toEqual({});
  });

  it('reverts invalid drafts instead of committing them', async () => {
    renderField();

    // The harness validation rejects values containing "invalid"
    await userEvent.type(screen.getByRole('textbox'), ' invalid');
    await userEvent.tab();

    // Nothing was persisted and the field returned to the stored
    // value
    expect(committedValues).toEqual({});
    expect(screen.getByRole('textbox')).toHaveValue(StoredValue);
  });

  it('discards the draft on cancel', async () => {
    renderField();

    await userEvent.type(screen.getByRole('textbox'), '!{Escape}');

    // The field returned to the stored value with nothing
    // committed, and leaving it commits nothing either
    expect(screen.getByRole('textbox')).toHaveValue(StoredValue);

    await userEvent.tab();

    expect(committedValues).toEqual({});
  });

  it('renders empty without a bound property', () => {
    // Unmapped elements resolve no property to display or write
    renderField({ propertyMap: {} });

    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

/**
 * Renders the field harness inside an entry property context
 * recording committed updates.
 */
function renderField(overrides: { propertyMap?: Record<string, string> } = {}) {
  return render(
    <DesignPropertiesProvider
      properties={[{ type: 'text', name: PropertyName }]}
      propertyValues={{ [PropertyName]: StoredValue }}
      propertyMap={overrides.propertyMap ?? { [ElementId]: PropertyName }}
      onUpdatePropertyValue={commitValue}
      onValidatePropertyValue={validateValue}
    >
      <FieldHarness />
    </DesignPropertiesProvider>,
  );
}

/**
 * Records a committed property update.
 */
function commitValue(name: string, value: PropertyValue) {
  committedValues[name] = value;
}

/**
 * Rejects values containing "invalid", standing in for property
 * validation.
 */
function validateValue(_name: string, value: PropertyValue) {
  return String(value).includes('invalid') ? 'invalid value' : undefined;
}

/**
 * Wires an input to the hook's edit cycle: typing stages a draft,
 * leaving commits, Escape cancels.
 */
const FieldHarness: React.FC = () => {
  const property = useElementProperty(ElementId);
  const field = useFieldPropertyValue(property);

  // Stage the typed draft
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    field.setDraft(event.target.value);
  }

  // Escape discards the draft
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      field.cancel();
    }
  }

  return (
    <input
      value={field.value}
      onChange={handleChange}
      onBlur={field.commit}
      onKeyDown={handleKeyDown}
    />
  );
};
