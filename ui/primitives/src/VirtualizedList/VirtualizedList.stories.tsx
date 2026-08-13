/**
 * VirtualizedList.stories.tsx
 * Dev reference for VirtualizedList.
 */
import { useRef, useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { Button } from '../Button';
import { MenuItem } from '../Menu';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { VirtualizedList, VirtualizerInstance } from './VirtualizedList';

/* --- Helpers --- */

interface DemoItem {
  id: string;
  label: string;
  /* Number of text lines, used by the varying height stories */
  lines: number;
}

/* 10,000 items, more than could be rendered unvirtualized */
const items: DemoItem[] = Array.from({ length: 10000 }, (_, index) => ({
  id: `item-${index}`,
  label: `Item ${index + 1}`,
  lines: (index % 3) + 1,
}));

const containerStyle = {
  height: 280,
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--surface-subtle)',
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  padding: '0 var(--space-3)',
  fontFamily: 'var(--font-ui)',
  fontSize: 'var(--font-size-sm)',
  color: 'var(--text-muted)',
};

/* Renders a plain fixed height row */
const renderRow = (item: DemoItem) => <div style={rowStyle}>{item.label}</div>;

/* Renders a row whose height varies with its line count */
const renderCard = (item: DemoItem) => (
  <div
    style={{
      margin: '0 var(--space-3) var(--space-2)',
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-accent)',
      fontFamily: 'var(--font-ui)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--text-muted)',
    }}
  >
    {Array.from({ length: item.lines }).map((_, line) => (
      <div key={line}>
        {item.label}
        {line > 0 && ' (continued)'}
      </div>
    ))}
  </div>
);

/* Returns the item ID as the row key */
const getItemKey = (item: DemoItem) => item.id;

/* Returns the height of a card row from its line count */
const getCardHeight = (item: DemoItem) => item.lines * 20 + 24;

/**
 * Demonstrates scrollToIndex: the highlighted row is kept in
 * view as the selection moves, as it would under keyboard
 * navigation.
 */
const ScrollToIndexDemo = () => {
  // The row scrolled into view
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Moves the highlight by the given number of rows
  function move(offset: number): void {
    setHighlightedIndex((index) =>
      Math.min(Math.max(index + offset, 0), items.length - 1),
    );
  }

  // Renders a row, highlighting the selected one
  function renderItem(item: DemoItem, index: number) {
    return (
      <MenuItem
        stringLabel={item.label}
        active={index === highlightedIndex}
        onClick={() => setHighlightedIndex(index)}
      />
    );
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button onClick={() => move(-1)}>Previous</Button>
        <Button onClick={() => move(1)}>Next</Button>
        <Button onClick={() => move(50)}>Jump +50</Button>
      </div>

      <VirtualizedList
        items={items}
        itemHeight={32}
        itemKey={getItemKey}
        renderItem={renderItem}
        scrollToIndex={highlightedIndex}
        style={containerStyle}
      />
    </div>
  );
};

/**
 * Demonstrates the virtualizer ref: scrolling to a row from
 * outside of render, as the Combobox does when an item is
 * highlighted.
 */
const ImperativeScrollDemo = () => {
  // The list's virtualizer, used to scroll to a row
  const virtualizerRef = useRef<VirtualizerInstance | null>(null);

  // Scrolls the given row to the top of the viewport
  function scrollTo(index: number): void {
    virtualizerRef.current?.scrollToIndex(index, { align: 'start' });
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Button onClick={() => scrollTo(0)}>Top</Button>
        <Button onClick={() => scrollTo(5000)}>Middle</Button>
        <Button onClick={() => scrollTo(items.length - 1)}>End</Button>
      </div>

      <VirtualizedList
        items={items}
        itemHeight={32}
        itemKey={getItemKey}
        renderItem={renderRow}
        virtualizerRef={virtualizerRef}
        style={containerStyle}
      />
    </div>
  );
};

/**
 * Demonstrates the enabled gate: while disabled, the list
 * renders no rows at all, as when a popup is closed.
 */
const EnabledGateDemo = () => {
  // Whether the virtualizer is active
  const [enabled, setEnabled] = useState(true);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
      <Button onClick={() => setEnabled((value) => !value)}>
        {enabled ? 'Disable' : 'Enable'}
      </Button>

      <VirtualizedList
        enabled={enabled}
        items={items}
        itemHeight={32}
        itemKey={getItemKey}
        renderItem={renderRow}
        style={containerStyle}
      />
    </div>
  );
};

export const VirtualizedListStories = () => (
  <Story title="VirtualizedList">
    {/* --------------------------------------------------------
        FIXED ROW HEIGHT
    -------------------------------------------------------- */}
    <StorySection
      title="Fixed row height"
      description="10,000 rows of the same height, only those in the viewport are mounted. The list height comes from the consumer, here a fixed height on the scroll area root."
    >
      <StoryRow>
        <StoryItem label="itemHeight={32}">
          <div style={{ width: 320 }}>
            <VirtualizedList
              items={items}
              itemHeight={32}
              itemKey={getItemKey}
              renderItem={renderRow}
              style={containerStyle}
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        VARYING ROW HEIGHTS
    -------------------------------------------------------- */}
    <StorySection
      title="Varying row heights"
      description="Rows of differing heights, either declared up front via a per-item itemHeight function, or measured after render with the measure prop (itemHeight then acts as the estimate)."
    >
      <StoryRow>
        <StoryItem label="itemHeight per item">
          <div style={{ width: 320 }}>
            <VirtualizedList
              items={items}
              itemHeight={getCardHeight}
              itemKey={getItemKey}
              renderItem={renderCard}
              style={containerStyle}
            />
          </div>
        </StoryItem>
        <StoryItem label="measure">
          <div style={{ width: 320 }}>
            <VirtualizedList
              measure
              items={items}
              itemHeight={44}
              itemKey={getItemKey}
              renderItem={renderCard}
              style={containerStyle}
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SCROLLING TO A ROW
    -------------------------------------------------------- */}
    <StorySection
      title="Scrolling to a row"
      description="scrollToIndex keeps a row in view as it changes, e.g. a keyboard highlight. The virtualizerRef scrolls to a row from outside of render."
    >
      <StoryRow>
        <StoryItem label="scrollToIndex">
          <div style={{ width: 320 }}>
            <ScrollToIndexDemo />
          </div>
        </StoryItem>
        <StoryItem label="virtualizerRef">
          <div style={{ width: 320 }}>
            <ImperativeScrollDemo />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        ACTIVATION GATE
    -------------------------------------------------------- */}
    <StorySection
      title="Activation gate"
      description="Set enabled to false while the list is hidden, e.g. inside a closed popup, to stop it measuring and rendering rows."
    >
      <StoryRow>
        <StoryItem label="enabled">
          <div style={{ width: 320 }}>
            <EnabledGateDemo />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        EMPTY LIST
    -------------------------------------------------------- */}
    <StorySection
      title="Empty list"
      description="Without items the list renders nothing, leaving the empty state to the consumer."
    >
      <StoryRow>
        <StoryItem label="items={[]}">
          <div style={{ width: 320, ...containerStyle, height: 80 }}>
            <VirtualizedList
              items={[]}
              itemHeight={32}
              renderItem={renderRow}
            />
          </div>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

registerStory({
  group: 'Layout',
  label: 'VirtualizedList',
  component: VirtualizedListStories,
});
