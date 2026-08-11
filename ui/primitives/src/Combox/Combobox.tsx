import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React, { useCallback, useRef, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ContentIcon } from '../ContentIcon';
import { IconProp, IconRenderer } from '../IconRenderer';
import { VirtualizerInstance } from '../VirtualizedList';
import { ComboboxChip } from './ComboboxChip';
import { ComboboxChipRemove } from './ComboboxChipRemove';
import { ComboboxChips } from './ComboboxChips';
import { ComboboxCollection } from './ComboboxCollection';
import { ComboboxEmpty } from './ComboboxEmpty';
import { ComboboxGroup } from './ComboboxGroup';
import { ComboboxGroupLabel } from './ComboboxGroupLabel';
import { ComboboxInput } from './ComboboxInput';
import { ComboboxItem } from './ComboboxItem';
import { ComboboxList } from './ComboboxList';
import { ComboboxPopup } from './ComboboxPopup';
import { ComboboxPortal } from './ComboboxPortal';
import {
  ComboboxPositioner,
  ComboboxPositionerProps,
} from './ComboboxPositioner';
import { ComboboxRoot, ComboboxRootProps } from './ComboboxRoot';
import {
  ComboboxTrigger,
  ComboboxTriggerSize,
  ComboboxTriggerVariant,
} from './ComboboxTrigger';
import { ComboboxValue } from './ComboboxValue';
import { ComboboxVirtualizedList } from './ComboboxVirtualizedList';
import './Combobox.css';

/* --- Combobox ---
   Convenience wrapper that composes Root + Trigger + Portal +
   Positioner + Popup + Input + List into a single component.
   Accepts items as data and renders chips for selected values.
   Items can optionally be grouped under labelled headings via
   the `groups` prop.

   Automatically uses virtualized rendering when a flat item
   count exceeds VIRTUALIZE_THRESHOLD. */

/** Item count above which the list is automatically virtualized */
const VIRTUALIZE_THRESHOLD = 50;

export interface ComboboxOption {
  /**
   * Display text for the item.
   */
  label: string;

  /**
   * Unique value for the item.
   */
  value: string;

  /**
   * Icon displayed before the label.
   */
  icon?: IconProp;

  /**
   * Content icon string displayed before the label.
   * Supports emoji, asset, and other content icon formats.
   */
  contentIcon?: string;
}

export interface ComboboxOptionGroup {
  /**
   * Unique value for the group.
   */
  value: string;

  /**
   * i18n key for the group heading. No heading is rendered when
   * neither `label` nor `stringLabel` is provided.
   */
  label?: TranslationKey;

  /**
   * Plain string heading rendered without i18n translation.
   * Takes priority over `label`.
   */
  stringLabel?: string;

  /**
   * The group's selectable items.
   */
  items: ComboboxOption[];
}

export interface ComboboxProps
  extends Omit<ComboboxRootProps, 'items' | 'children' | 'multiple'> {
  /**
   * List of selectable items. Ignored when `groups` is provided.
   */
  items?: ComboboxOption[];

  /**
   * List of item groups rendered with group headings. Takes
   * priority over `items`. Grouped lists are never virtualized.
   */
  groups?: ComboboxOptionGroup[];

  /**
   * Whether multiple items can be selected.
   * @default false
   */
  multiple?: boolean;

  /**
   * The initially selected item. Only applies to single-select
   * mode.
   */
  defaultValue?: ComboboxOption;

  /**
   * Visual style of the trigger.
   * @default 'outline'
   */
  variant?: ComboboxTriggerVariant;

  /**
   * How the selected value is displayed in the trigger. `text`
   * renders it as plain select-like text without a clear button.
   * Only applies to single-select mode.
   * @default 'chip'
   */
  valueVariant?: 'chip' | 'text';

  /**
   * Min-height of the trigger.
   * @default 'lg'
   */
  size?: ComboboxTriggerSize;

  /**
   * Marks the trigger as invalid (applies error styling).
   */
  invalid?: boolean;

  /**
   * Placeholder text shown when no items are selected.
   */
  placeholder?: string;

  /**
   * Placeholder text for the search input inside the popup.
   */
  searchPlaceholder?: TranslationKey;

  /*
   * Plain string search placeholder used as-is without i18n
   * translation. Takes priority over `searchPlaceholder`.
   */
  stringSearchPlaceholder?: string;

  /**
   * Text shown when no items match the search.
   */
  emptyText?: string;

  /**
   * Which side of the trigger the popup appears on.
   * @default 'bottom'
   */
  side?: ComboboxPositionerProps['side'];

  /**
   * Alignment of the popup relative to the trigger.
   * @default 'start'
   */
  align?: ComboboxPositionerProps['align'];

  /**
   * Distance between the trigger and the popup edge (px).
   */
  sideOffset?: ComboboxPositionerProps['sideOffset'];
}

/** Pre-composed multi-select combobox with chips trigger and search popup. */
export const Combobox: React.FC<ComboboxProps> = ({
  items = [],
  groups,
  multiple = false,
  defaultValue,
  variant = 'outline',
  valueVariant = 'chip',
  size = 'lg',
  invalid,
  placeholder,
  searchPlaceholder,
  stringSearchPlaceholder,
  emptyText,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  onValueChange: onValueChangeProp,
  ...rootProps
}) => {
  // Only flat item lists are virtualized
  const virtualized = !groups && items.length > VIRTUALIZE_THRESHOLD;
  const virtualizerRef = useRef<VirtualizerInstance | null>(null);
  const [open, setOpen] = useState(false);

  /* Track single-select value so we can clear it via the X button */
  const [singleValue, setSingleValue] = useState<ComboboxOption | null>(
    defaultValue ?? null,
  );

  /* Wrapper around consumer's onValueChange that also tracks internal state */
  const handleValueChange = useCallback(
    (
      value: ComboboxOption | ComboboxOption[] | null,
      eventDetails: ComboboxPrimitive.Root.ChangeEventDetails,
    ) => {
      if (!multiple) {
        setSingleValue(value as ComboboxOption | null);
      }

      onValueChangeProp?.(value, eventDetails);
    },
    [multiple, onValueChangeProp],
  );

  /* Clear the single-select value */
  const clearSingleValue = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setSingleValue(null);
  };

  /* Scroll the virtualizer to the highlighted item when needed */
  const handleItemHighlighted = (
    item: ComboboxOption | undefined,
    { reason, index }: ComboboxPrimitive.Root.HighlightEventDetails,
  ) => {
    const virtualizer = virtualizerRef.current;

    if (!item || !virtualizer) {
      return;
    }

    const isStart = index === 0;
    const isEnd = index === virtualizer.options.count - 1;
    const shouldScroll =
      reason === 'none' || (reason === 'keyboard' && (isStart || isEnd));

    if (shouldScroll) {
      queueMicrotask(() => {
        virtualizer.scrollToIndex(index, {
          align: isEnd ? 'start' : 'end',
        });
      });
    }
  };

  /* Render the icon and label content shared by all chips */
  const renderChipContent = (item: ComboboxOption) => (
    <>
      {item.icon && (
        <IconRenderer
          icon={item.icon}
          size={12}
          className="combobox-chip-icon"
        />
      )}
      {item.contentIcon && (
        <ContentIcon icon={item.contentIcon} className="combobox-chip-icon" />
      )}
      <span className="combobox-chip-label">{item.label}</span>
    </>
  );

  /* Render selected values as chips for multiple mode */
  const renderMultipleValue = (selectedValues: ComboboxOption[]) => (
    <ComboboxChips>
      {selectedValues.map((item) => (
        <ComboboxPrimitive.Chip key={item.value} render={<ComboboxChip />}>
          {renderChipContent(item)}
          <ComboboxPrimitive.ChipRemove render={<ComboboxChipRemove />} />
        </ComboboxPrimitive.Chip>
      ))}
    </ComboboxChips>
  );

  /* Render the popup list in grouped, virtualized, or flat form */
  const renderList = () => {
    // Grouped items render as labelled groups
    if (groups) {
      return (
        <ComboboxList>
          {(group: ComboboxOptionGroup) => (
            <ComboboxGroup key={group.value} items={group.items}>
              {/* Only render a heading when the group has a label */}
              {(group.label || group.stringLabel) && (
                <ComboboxGroupLabel
                  label={group.label}
                  stringLabel={group.stringLabel}
                />
              )}
              <ComboboxCollection>
                {(item: ComboboxOption) => (
                  <ComboboxItem
                    key={item.value}
                    value={item}
                    label={item.label}
                    icon={item.icon}
                    contentIcon={item.contentIcon}
                  />
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      );
    }

    // Use virtualized rendering for large item lists
    if (virtualized) {
      return (
        <ComboboxPrimitive.List className="combobox-list">
          <ComboboxVirtualizedList
            open={open}
            virtualizerRef={virtualizerRef}
          />
        </ComboboxPrimitive.List>
      );
    }

    return (
      <ComboboxList>
        {(item: ComboboxOption) => (
          <ComboboxItem
            key={item.value}
            value={item}
            label={item.label}
            icon={item.icon}
            contentIcon={item.contentIcon}
          />
        )}
      </ComboboxList>
    );
  };

  /* Render selected value as a chip or plain text for single mode */
  const renderSingleValue = (selectedValue: ComboboxOption | null) => {
    if (!selectedValue) {
      return null;
    }

    // Render the value as plain select-like text
    if (valueVariant === 'text') {
      return (
        <span className="combobox-text-value">
          {selectedValue.icon && (
            <IconRenderer
              icon={selectedValue.icon}
              size={14}
              className="combobox-text-value-icon"
            />
          )}
          {selectedValue.contentIcon && (
            <ContentIcon
              icon={selectedValue.contentIcon}
              className="combobox-text-value-icon"
            />
          )}
          <span className="combobox-text-value-label">
            {selectedValue.label}
          </span>
        </span>
      );
    }

    return (
      <ComboboxChip>
        {renderChipContent(selectedValue)}
        <ComboboxChipRemove onClick={clearSingleValue} />
      </ComboboxChip>
    );
  };

  return (
    <ComboboxRoot
      items={groups ?? items}
      multiple={multiple}
      autoHighlight
      onValueChange={handleValueChange}
      {...(!multiple && { value: singleValue })}
      {...(virtualized && {
        virtualized: true,
        open,
        onOpenChange: setOpen,
        onItemHighlighted: handleItemHighlighted,
      })}
      {...rootProps}
    >
      <ComboboxTrigger
        variant={variant}
        size={size}
        invalid={invalid}
        className={
          valueVariant === 'text' ? 'combobox-trigger-value-text' : undefined
        }
      >
        <ComboboxValue
          placeholder={
            placeholder ? (
              <span className="combobox-trigger-placeholder">
                {placeholder}
              </span>
            ) : undefined
          }
        >
          {multiple ? renderMultipleValue : renderSingleValue}
        </ComboboxValue>
      </ComboboxTrigger>

      <ComboboxPortal>
        <ComboboxPositioner side={side} align={align} sideOffset={sideOffset}>
          <ComboboxPopup>
            <ComboboxInput
              placeholder={searchPlaceholder}
              stringPlaceholder={stringSearchPlaceholder}
            />

            {renderList()}

            {emptyText && <ComboboxEmpty>{emptyText}</ComboboxEmpty>}
          </ComboboxPopup>
        </ComboboxPositioner>
      </ComboboxPortal>
    </ComboboxRoot>
  );
};
