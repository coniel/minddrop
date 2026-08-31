import { useEffect, useRef, useState } from 'react';
import { i18n } from '@minddrop/i18n';
import {
  PropertySchema,
  PropertySchemas,
  SelectPropertyOption,
  SelectPropertySchema,
} from '@minddrop/properties';
import {
  Button,
  ContentColorValues,
  DropdownMenu,
  DropdownMenuColorSelectionItem,
  IconButton,
  KeyboardShortcut,
  SwitchField,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/ui-theme';
import {
  PropertyEditorBase,
  PropertyEditorBaseProps,
} from '../PropertyEditorBase';
import './SelectPropertyEditor.css';

export interface SelectPropertyEditorProps
  extends Omit<PropertyEditorBaseProps, 'property' | 'children'> {
  property: SelectPropertySchema;
}

export const SelectPropertyEditor: React.FC<SelectPropertyEditorProps> = ({
  property,
  onSave,
  onCancel,
  onOpen,
  ...other
}) => {
  const inputRefs = useRef(new Map<number, HTMLInputElement>());
  // Options carry a session-local id keying their row and input ref,
  // keeping both stable when options are removed mid-list
  const [options, setOptions] = useState<EditorOption[]>(() =>
    property.options.map(toEditorOption),
  );
  const [multiselect, setMultiselect] = useState(property.multiselect ?? false);
  const [isOptionFocused, setIsOptionFocused] = useState(false);
  const prevLengthRef = useRef(options.length);

  // Focus the last option's input when a new option is added
  useEffect(() => {
    if (options.length > prevLengthRef.current) {
      const lastOption = options[options.length - 1];

      inputRefs.current.get(lastOption.id)?.focus();
    }

    prevLengthRef.current = options.length;
  }, [options]);

  // When opened with defaultOpen and no options, add and focus one immediately.
  // Skip if property has its default name, in which case PropertyEditorBase
  // will focus the name field instead, and Enter will trigger option addition.
  useEffect(() => {
    const isDefaultName =
      property.name === i18n.t(PropertySchemas[property.type].name);

    if (other.defaultOpen && property.options.length === 0 && !isDefaultName) {
      handleAddOption();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(savedProperty: PropertySchema) {
    // Filter out empty options before saving
    const filteredOptions = options.filter(
      (option) => option.value.trim() !== '',
    );

    // Update local state to match saved options
    setOptions(filteredOptions);

    return onSave({
      ...(savedProperty as SelectPropertySchema),
      options: filteredOptions.map(toPropertyOption),
      multiselect,
    });
  }

  function handleCancel() {
    // Reset to the original options, filtering out any empty ones
    setOptions(
      property.options
        .filter((option) => option.value.trim() !== '')
        .map(toEditorOption),
    );
    setMultiselect(property.multiselect ?? false);

    if (onCancel) {
      onCancel();
    }
  }

  function handleAddOption() {
    // Pick a random color, preferring ones no option uses yet
    const usedColors = new Set(options.map((option) => option.color));
    const unusedColors = ContentColorValues.filter(
      (colorOption) => !usedColors.has(colorOption.value),
    );
    const pool = unusedColors.length > 0 ? unusedColors : ContentColorValues;
    const color = pool[Math.floor(Math.random() * pool.length)].value;

    // Append the new empty option
    setOptions([...options, toEditorOption({ value: '', color })]);
  }

  function handleDeleteOption(id: number) {
    setOptions(options.filter((option) => option.id !== id));
  }

  function handleOptionNameChange(id: number, value: string) {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, value } : option,
      ),
    );
  }

  function handleOptionColorChange(id: number, color: ContentColor) {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, color } : option,
      ),
    );
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    option: EditorOption,
  ) {
    // Enter adds a new option below
    if (event.key === 'Enter') {
      handleAddOption();

      return;
    }

    if (event.key !== 'Escape') {
      return;
    }

    // Escape removes the option if it is empty
    if (option.value.trim() === '') {
      handleDeleteOption(option.id);
    }

    // Blur the field
    event.currentTarget.blur();
  }

  function handleOptionsBlur(event: React.FocusEvent<HTMLDivElement>) {
    // Only unset the focus flag when focus leaves the options
    // container entirely
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsOptionFocused(false);
    }
  }

  function setInputRef(id: number, element: HTMLInputElement | null) {
    // Track the input by its option's id, dropping the entry on unmount
    if (element) {
      inputRefs.current.set(id, element);
    } else {
      inputRefs.current.delete(id);
    }
  }

  function handleNameEnter() {
    // Focus the first empty option, adding one if none are empty
    const firstEmptyOption = options.find(
      (option) => option.value.trim() === '',
    );

    if (firstEmptyOption) {
      inputRefs.current.get(firstEmptyOption.id)?.focus();
    } else {
      handleAddOption();
    }
  }

  function handleOpen() {
    const isDefaultName =
      property.name === i18n.t(PropertySchemas[property.type].name);

    if (options.length === 0 && !isDefaultName) {
      handleAddOption();
    }

    if (onOpen) {
      onOpen();
    }
  }

  return (
    <PropertyEditorBase
      property={property}
      onSave={handleSave}
      onCancel={handleCancel}
      onOpen={handleOpen}
      onNameEnter={handleNameEnter}
      nameEnterHint="properties.select.options.nameEnterHint"
      {...other}
    >
      <div
        className="properties-select-options"
        onFocus={() => setIsOptionFocused(true)}
        onBlur={handleOptionsBlur}
      >
        {options.map((option) => (
          <div key={option.id} className="properties-select-option-row">
            <TextInput
              ref={(element) => setInputRef(option.id, element)}
              variant="subtle"
              size="md"
              value={option.value}
              placeholder="properties.select.options.placeholder"
              onValueChange={(value) =>
                handleOptionNameChange(option.id, value)
              }
              onKeyDown={(event) => handleOptionKeyDown(event, option)}
              leading={
                <DropdownMenu
                  trigger={
                    <button
                      className="properties-select-option-color-button"
                      type="button"
                    >
                      <span
                        className={`properties-select-option-color-swatch properties-select-option-color-swatch-${option.color}`}
                      />
                    </button>
                  }
                >
                  {ContentColorValues.map((colorOption) => (
                    <DropdownMenuColorSelectionItem
                      key={colorOption.value}
                      color={colorOption.value}
                      onClick={() =>
                        handleOptionColorChange(option.id, colorOption.value)
                      }
                    />
                  ))}
                </DropdownMenu>
              }
            />
            <IconButton
              icon="x"
              size="sm"
              variant="ghost"
              color="neutral"
              label="actions.delete"
              className="properties-select-option-delete-button"
              onClick={() => handleDeleteOption(option.id)}
            />
          </div>
        ))}
        <div className="properties-select-options-add">
          <Button
            size="sm"
            variant="ghost"
            label="properties.select.options.add"
            onClick={handleAddOption}
          />
          {isOptionFocused && (
            <div className="properties-select-options-add-hint">
              <KeyboardShortcut keys={['Enter']} color="subtle" size="xs" />
              <Text
                color="subtle"
                size="xs"
                text="properties.select.options.addHint"
              />
            </div>
          )}
        </div>
      </div>
      <div className="properties-select-multiselect">
        <SwitchField
          size="sm"
          checked={multiselect}
          onCheckedChange={setMultiselect}
          label="properties.select.multiselect.label"
        />
      </div>
    </PropertyEditorBase>
  );
};

/**
 * A select option carrying a session-local id used to key its row.
 */
interface EditorOption extends SelectPropertyOption {
  id: number;
}

// Source of the session-local option ids
let nextOptionId = 0;

/**
 * Wraps a select option with a session-local id.
 *
 * @param option - The option to wrap.
 * @returns The option with an id.
 */
function toEditorOption(option: SelectPropertyOption): EditorOption {
  nextOptionId += 1;

  return { ...option, id: nextOptionId };
}

/**
 * Strips the session-local id from an editor option.
 *
 * @param option - The editor option to strip.
 * @returns The plain select option.
 */
function toPropertyOption(option: EditorOption): SelectPropertyOption {
  const { id, ...propertyOption } = option;

  return propertyOption;
}
