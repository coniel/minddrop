import React, { useCallback, useRef, useState } from 'react';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { Combobox, ComboboxOption } from './Combobox';

/* ============================================================
   SHARED DATA
   ============================================================ */

const DATABASES: ComboboxOption[] = [
  { label: 'Tasks', value: 'tasks', icon: 'check-square' },
  { label: 'Projects', value: 'projects', icon: 'folder' },
  { label: 'Contacts', value: 'contacts', icon: 'users' },
  { label: 'Meeting Notes', value: 'meeting-notes', icon: 'file-text' },
  { label: 'Bookmarks', value: 'bookmarks', icon: 'bookmark' },
  { label: 'Recipes', value: 'recipes', icon: 'chef-hat' },
  { label: 'Reading List', value: 'reading-list', icon: 'book-open' },
  { label: 'Expenses', value: 'expenses', icon: 'receipt' },
  { label: 'Journal', value: 'journal', icon: 'notebook-pen' },
  { label: 'Habits', value: 'habits', icon: 'repeat' },
];

const LONG_NAMES: ComboboxOption[] = [
  {
    label: 'Weekly team standup meeting notes',
    value: 'weekly-standup',
    icon: 'file-text',
  },
  {
    label: 'Q4 2025 marketing campaign tracker',
    value: 'q4-marketing',
    icon: 'folder',
  },
  {
    label: 'Customer onboarding feedback responses',
    value: 'onboarding-feedback',
    icon: 'users',
  },
  {
    label: 'Personal development reading list',
    value: 'reading-list',
    icon: 'book-open',
  },
  {
    label: 'Home renovation project expenses',
    value: 'renovation',
    icon: 'receipt',
  },
];

const SCROLLABLE_ITEMS: ComboboxOption[] = Array.from(
  { length: 30 },
  (_, index) => ({
    label: `Item ${String(index + 1).padStart(2, '0')}`,
    value: `item-${index + 1}`,
  }),
);

const MANY_ITEMS: ComboboxOption[] = Array.from(
  { length: 200 },
  (_, index) => ({
    label: `Item ${String(index + 1).padStart(3, '0')}`,
    value: `item-${index + 1}`,
  }),
);

/* ============================================================
   STORIES
   ============================================================ */

export const ComboboxStories = () => (
  <Story title="Combobox">
    {/* --------------------------------------------------------
        DEFAULT (single select)
    -------------------------------------------------------- */}
    <StorySection
      title="Default"
      description="Single-select combobox. Closes on select."
    >
      <StoryRow>
        <StoryItem label="lg">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              placeholder="Select database..."
              searchPlaceholder="Search databases..."
              emptyText="No databases found."
            />
          </div>
        </StoryItem>
        <StoryItem label="md">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              size="md"
              placeholder="Select database..."
              searchPlaceholder="Search databases..."
              emptyText="No databases found."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        MULTI-SELECT
    -------------------------------------------------------- */}
    <StorySection
      title="Multi-select"
      description="Multiple items can be selected. Renders chips."
    >
      <StoryRow>
        <StoryItem label="outline (default)">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              placeholder="Select databases..."
              searchPlaceholder="Search databases..."
              emptyText="No databases found."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VARIANTS
    -------------------------------------------------------- */}
    <StorySection title="Variants" description="Visual style of the trigger.">
      <StoryRow>
        <StoryItem label="subtle">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              variant="subtle"
              size="md"
              placeholder="Select databases..."
              searchPlaceholder="Search..."
              emptyText="No databases found."
            />
          </div>
        </StoryItem>
        <StoryItem label="outline">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              variant="outline"
              size="md"
              placeholder="Select databases..."
              searchPlaceholder="Search..."
              emptyText="No databases found."
            />
          </div>
        </StoryItem>
        <StoryItem label="filled">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              variant="filled"
              size="md"
              placeholder="Select databases..."
              searchPlaceholder="Search..."
              emptyText="No databases found."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SIZES
    -------------------------------------------------------- */}
    <StorySection title="Sizes" description="md, lg trigger height.">
      <StoryRow>
        <StoryItem label="md">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              size="md"
              placeholder="Select databases..."
              searchPlaceholder="Search..."
            />
          </div>
        </StoryItem>
        <StoryItem label="lg">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              size="lg"
              placeholder="Select databases..."
              searchPlaceholder="Search..."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        INVALID
    -------------------------------------------------------- */}
    <StorySection title="Invalid" description="Error styling on the trigger.">
      <StoryRow>
        <StoryItem label="invalid outline">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              size="md"
              invalid
              placeholder="Select databases..."
              searchPlaceholder="Search..."
            />
          </div>
        </StoryItem>
        <StoryItem label="invalid subtle">
          <div style={{ width: 300 }}>
            <Combobox
              items={DATABASES}
              multiple
              variant="subtle"
              size="md"
              invalid
              placeholder="Select databases..."
              searchPlaceholder="Search..."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        OVERFLOW (long names, resizable)
    -------------------------------------------------------- */}
    <StorySection
      title="Overflow"
      description="Long item names in a resizable container. Chips truncate with ellipsis."
    >
      <StoryRow>
        <StoryItem label="lg">
          <ResizableContainer>
            <Combobox
              items={LONG_NAMES}
              multiple
              placeholder="Select databases..."
              searchPlaceholder="Search..."
              emptyText="No databases found."
            />
          </ResizableContainer>
        </StoryItem>
        <StoryItem label="md">
          <ResizableContainer>
            <Combobox
              items={LONG_NAMES}
              multiple
              size="md"
              placeholder="Select databases..."
              searchPlaceholder="Search..."
              emptyText="No databases found."
            />
          </ResizableContainer>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SCROLLABLE (non-virtualized)
    -------------------------------------------------------- */}
    <StorySection
      title="Scrollable"
      description="List long enough to scroll but under the virtualization threshold."
    >
      <StoryRow>
        <StoryItem label="30 items">
          <div style={{ width: 300 }}>
            <Combobox
              items={SCROLLABLE_ITEMS}
              multiple
              placeholder="Select items..."
              searchPlaceholder="Search items..."
              emptyText="No items found."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VIRTUALIZED (auto, >50 items)
    -------------------------------------------------------- */}
    <StorySection
      title="Virtualized"
      description="Automatically virtualized when items exceed 50."
    >
      <StoryRow>
        <StoryItem label="200 items">
          <div style={{ width: 300 }}>
            <Combobox
              items={MANY_ITEMS}
              multiple
              placeholder="Select items..."
              searchPlaceholder="Search items..."
              emptyText="No items found."
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

/* --- ResizableContainer ---
   Simple drag-to-resize wrapper for stories. Uses a drag handle
   on the right edge instead of CSS resize to avoid interfering
   with input focus. */

const ResizableContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = width;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX;

        setWidth(Math.max(150, startWidth + delta));
      };

      const handlePointerUp = () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [width],
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', width }}>
      {children}

      {/* Drag handle */}
      <div
        onPointerDown={handlePointerDown}
        style={{
          position: 'absolute',
          top: 0,
          right: -8,
          bottom: 0,
          width: 4,
          borderRadius: 2,
          backgroundColor: 'var(--border-default)',
          cursor: 'col-resize',
        }}
      />
    </div>
  );
};
