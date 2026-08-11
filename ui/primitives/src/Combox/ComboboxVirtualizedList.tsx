import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox';
import React from 'react';
import { VirtualizedList, VirtualizerInstance } from '../VirtualizedList';
import { ComboboxOption } from './Combobox';
import { ComboboxItem } from './ComboboxItem';

/* --- ComboboxVirtualizedList ---
   Renders combobox items in a virtualized list for efficient
   rendering of large lists. Automatically used by the Combobox
   wrapper when the item count exceeds the threshold. */

/** Item height estimate in pixels */
const ITEM_HEIGHT = 32;

export interface ComboboxVirtualizedListProps {
  /**
   * Whether the combobox popup is open. Controls virtualizer
   * activation to avoid measuring when hidden.
   */
  open: boolean;

  /**
   * Ref to the virtualizer instance, used by the root's
   * onItemHighlighted handler for scroll-to-index.
   */
  virtualizerRef: React.RefObject<VirtualizerInstance | null>;
}

/** Virtualized item list for large combobox datasets. */
export const ComboboxVirtualizedList: React.FC<
  ComboboxVirtualizedListProps
> = ({ open, virtualizerRef }) => {
  const filteredItems = ComboboxPrimitive.useFilteredItems<ComboboxOption>();

  // Renders a single combobox option
  function renderItem(item: ComboboxOption, index: number) {
    return (
      <ComboboxItem
        index={index}
        value={item}
        label={item.label}
        icon={item.icon}
        contentIcon={item.contentIcon}
      />
    );
  }

  return (
    <VirtualizedList
      measure
      enabled={open}
      items={filteredItems}
      itemHeight={ITEM_HEIGHT}
      renderItem={renderItem}
      virtualizerRef={virtualizerRef}
      className="combobox-list-scroll-area"
    />
  );
};
