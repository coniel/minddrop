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
  ContentColors,
  DropdownMenu,
  DropdownMenuColorSelectionItem,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
  IconButton,
  KeyboardShortcut,
  SwitchField,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { ContentColor } from '@minddrop/utils';
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
  const [options, setOptions] = useState<SelectPropertyOption[]>(
    property.options,
  );
  const [multiselect, setMultiselect] = useState(property.multiselect ?? false);
  const [isOptionFocused, setIsOptionFocused] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const prevLengthRef = useRef(options.length);

  useEffect(() => {
    if (options.length > prevLengthRef.current) {
      inputRefs.current[options.length - 1]?.focus();
    }

    prevLengthRef.current = options.length;
  }, [options.length]);

  // When opened with defaultOpen and no options, add and focus one immediately.
  // Skip if property has its default name — PropertyEditorBase will focus the
  // name field instead, and Enter will trigger option addition.
  useEffect(() => {
    const isDefaultName =
      property.name === i18n.t(PropertySchemas[property.type].name);

    if (other.defaultOpen && property.options.length === 0 && !isDefaultName) {
      handleAddOption();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSave(savedProperty: PropertySchema) {
    return onSave({
      ...(savedProperty as SelectPropertySchema),
      options: options.filter((opt) => opt.value.trim() !== ''),
      multiselect,
    });
  }

  function handleCancel() {
    setOptions(property.options);
    setMultiselect(property.multiselect ?? false);

    if (onCancel) {
      onCancel();
    }
  }

  function handleAddOption() {
    const usedColors = new Set(options.map((opt) => opt.color));
    const unusedColors = ContentColors.filter((c) => !usedColors.has(c.value));
    const pool = unusedColors.length > 0 ? unusedColors : ContentColors;
    const color = pool[Math.floor(Math.random() * pool.length)].value;

    setOptions([...options, { value: '', color }]);
  }

  function handleDeleteOption(index: number) {
    setOptions(options.filter((_, i) => i !== index));
  }

  function handleOptionNameChange(index: number, value: string) {
    setOptions(
      options.map((opt, i) => (i === index ? { ...opt, value } : opt)),
    );
  }

  function handleOptionColorChange(index: number, color: ContentColor) {
    setOptions(
      options.map((opt, i) => (i === index ? { ...opt, color } : opt)),
    );
  }

  function handleNameEnter() {
    const firstEmptyIndex = options.findIndex((opt) => opt.value.trim() === '');

    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex]?.focus();
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
        className="select-options"
        onFocus={() => setIsOptionFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOptionFocused(false);
          }
        }}
      >
        {options.map((option, index) => (
          <div key={index} className="select-option-row">
            <TextInput
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              variant="subtle"
              size="md"
              value={option.value}
              placeholder="properties.select.options.placeholder"
              onValueChange={(value) => handleOptionNameChange(index, value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddOption();
                }
              }}
              leading={
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="option-color-button" type="button">
                      <span
                        className={`option-color-swatch option-color-swatch-${option.color}`}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuPositioner>
                      <DropdownMenuContent>
                        {ContentColors.map((c) => (
                          <DropdownMenuColorSelectionItem
                            key={c.value}
                            color={c.value}
                            onClick={() =>
                              handleOptionColorChange(index, c.value)
                            }
                          />
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenuPositioner>
                  </DropdownMenuPortal>
                </DropdownMenu>
              }
            />
            <IconButton
              icon="x"
              size="sm"
              variant="ghost"
              color="neutral"
              label="actions.delete"
              className="option-delete-button"
              onClick={() => handleDeleteOption(index)}
            />
          </div>
        ))}
        <div className="select-options-add">
          <Button
            size="sm"
            variant="ghost"
            label="properties.select.options.add"
            onClick={handleAddOption}
          />
          {isOptionFocused && (
            <div className="select-options-add-hint">
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
      <div className="select-multiselect">
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
