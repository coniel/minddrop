import React from 'react';
import {
  Filters,
  PropertyFilterDraft,
  PropertyFilterOperator,
  PropertyFilterValue,
} from '@minddrop/filters';
import { PropertySchema } from '@minddrop/properties';
import {
  PropertyFilterOperatorSelect,
  PropertyFilterValueInput,
} from '@minddrop/ui-filters';
import {
  Button,
  ContentIcon,
  Group,
  Stack,
  Text,
  useKeepMenuFocus,
} from '@minddrop/ui-primitives';

export interface FilterEditorProps {
  /**
   * The schema of the filtered property. Missing when no database
   * declares it any more.
   */
  property?: PropertySchema;

  /**
   * The filter being edited.
   */
  filter: PropertyFilterDraft;

  /**
   * Callback fired with the edited filter.
   */
  onChange(filter: PropertyFilterDraft): void;

  /**
   * Callback fired when the filter is removed. Omitted for
   * filters not yet added.
   */
  onRemove?(): void;

  /**
   * Callback fired when adding the filter is cancelled. Renders
   * the Cancel and Done buttons together with `onDone`.
   */
  onCancel?(): void;

  /**
   * Callback fired when adding the filter is confirmed. Disabled
   * while the filter is incomplete.
   */
  onDone?(): void;
}

/**
 * Renders a filter's operator and value fields under the filtered
 * property's name.
 */
export const FilterEditor: React.FC<FilterEditorProps> = ({
  property,
  filter,
  onChange,
  onRemove,
  onCancel,
  onDone,
}) => {
  // Keep the surrounding menu's focus in the fields while typing
  useKeepMenuFocus();

  // Change the operator, clearing the value when the new operator
  // takes none.
  function handleOperatorChange(operator: PropertyFilterOperator): void {
    onChange({
      ...filter,
      operator,
      value: Filters.constants.ValueLessOperators.has(operator)
        ? undefined
        : filter.value,
    });
  }

  // Change the value
  function handleValueChange(value: PropertyFilterValue | undefined): void {
    onChange({ ...filter, value });
  }

  // Stop key presses in the fields from reaching the surrounding
  // menu's navigation.
  function handleKeyDown(event: React.KeyboardEvent): void {
    event.stopPropagation();
  }

  return (
    <Stack gap={2} className="filter-editor" onKeyDown={handleKeyDown}>
      {/* Filtered property heading */}
      <Group gap={1} className="filter-editor-heading">
        {property?.icon && <ContentIcon icon={property.icon} />}
        <Text size="sm" weight="semibold">
          {property?.name ?? filter.property}
        </Text>
      </Group>

      {/* Operator picker */}
      {property && (
        <PropertyFilterOperatorSelect
          property={property}
          value={filter.operator}
          onValueChange={handleOperatorChange}
        />
      )}

      {/* Value input for the selected operator */}
      {property && (
        <PropertyFilterValueInput
          property={property}
          operator={filter.operator}
          value={filter.value}
          onChange={handleValueChange}
        />
      )}

      {/* Removal of an existing filter */}
      {onRemove && (
        <Button
          variant="subtle"
          danger="on-hover"
          size="sm"
          label="filters.menu.remove"
          onClick={onRemove}
        />
      )}

      {/* Confirmation of a new filter */}
      {onCancel && onDone && (
        <Group gap={1} justify="end">
          <Button
            variant="subtle"
            size="sm"
            label="actions.cancel"
            onClick={onCancel}
          />
          <Button
            variant="solid"
            color="primary"
            size="sm"
            label="actions.done"
            disabled={!Filters.isComplete(filter)}
            onClick={onDone}
          />
        </Group>
      )}
    </Stack>
  );
};
