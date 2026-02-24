/**
 * ScrollArea.stories.tsx
 * Dev reference for ScrollArea, VerticalScrollArea, HorizontalScrollArea.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { HorizontalScrollArea } from './HorizontalScrollArea';
import { ScrollArea } from './ScrollArea';
import { VerticalScrollArea } from './VerticalScrollArea';

/* --- Helpers --- */

const LoremParagraphs = ({ count = 20 }: { count?: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <p
        key={i}
        style={{
          margin: '0 0 var(--space-3)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          lineHeight: 'var(--leading-normal)',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris.
      </p>
    ))}
  </>
);

const WideContent = () => (
  <div
    style={{
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-2)',
      width: 'max-content',
    }}
  >
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 120,
          height: 80,
          flexShrink: 0,
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-neutral)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
        }}
      >
        Item {i + 1}
      </div>
    ))}
  </div>
);

const containerStyle = {
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--surface-subtle)',
};

export const ScrollAreaStories = () => (
  <Story title="ScrollArea">
    {/* --------------------------------------------------------
        VERTICAL SCROLL AREA — VISIBILITY MODES
    -------------------------------------------------------- */}
    <StorySection
      title="VerticalScrollArea — visibility"
      description="hover: shown on container hover. scroll: fades in on scroll, out after ~1.5s idle (macOS timing). always: permanently visible."
    >
      <StoryRow>
        <StoryItem label="hover (default)">
          <VerticalScrollArea
            visibility="hover"
            style={{ height: 240, ...containerStyle }}
          >
            <div style={{ padding: 'var(--space-3)' }}>
              <LoremParagraphs count={20} />
            </div>
          </VerticalScrollArea>
        </StoryItem>
        <StoryItem label="scroll">
          <VerticalScrollArea
            visibility="scroll"
            style={{ height: 240, ...containerStyle }}
          >
            <div style={{ padding: 'var(--space-3)' }}>
              <LoremParagraphs count={20} />
            </div>
          </VerticalScrollArea>
        </StoryItem>
        <StoryItem label="always">
          <VerticalScrollArea
            visibility="always"
            style={{ height: 240, ...containerStyle }}
          >
            <div style={{ padding: 'var(--space-3)' }}>
              <LoremParagraphs count={20} />
            </div>
          </VerticalScrollArea>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        HORIZONTAL SCROLL AREA
    -------------------------------------------------------- */}
    <StorySection
      title="HorizontalScrollArea"
      description="Scrollbar appears along the bottom. Content wider than container triggers the scrollbar."
    >
      <StoryRow>
        <StoryItem label="hover">
          <HorizontalScrollArea
            visibility="hover"
            style={{ width: 360, ...containerStyle }}
          >
            <WideContent />
          </HorizontalScrollArea>
        </StoryItem>
        <StoryItem label="always">
          <HorizontalScrollArea
            visibility="always"
            style={{ width: 360, ...containerStyle }}
          >
            <WideContent />
          </HorizontalScrollArea>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        SCROLL AREA — BOTH AXES
    -------------------------------------------------------- */}
    <StorySection
      title="ScrollArea — both axes"
      description="Vertical and horizontal scrollbars with a corner piece. Use when content can overflow in both directions."
    >
      <StoryRow>
        <StoryItem label="hover">
          <ScrollArea
            visibility="hover"
            style={{ width: 320, height: 200, ...containerStyle }}
          >
            <div style={{ width: 600, padding: 'var(--space-3)' }}>
              <LoremParagraphs count={8} />
            </div>
          </ScrollArea>
        </StoryItem>
        <StoryItem label="always">
          <ScrollArea
            visibility="always"
            style={{ width: 320, height: 200, ...containerStyle }}
          >
            <div style={{ width: 600, padding: 'var(--space-3)' }}>
              <LoremParagraphs count={8} />
            </div>
          </ScrollArea>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        THUMB EXPAND ON HOVER
        Demonstrates the macOS-style thin→wide expansion.
    -------------------------------------------------------- */}
    <StorySection
      title="Thumb expansion"
      description="Hover over the scrollbar track area to see the thumb expand from 4px to 8px — same as macOS. The hit area is always full width so it's easy to grab."
    >
      <StoryRow>
        <StoryItem label="hover thumb to expand">
          <VerticalScrollArea
            visibility="always"
            style={{ height: 200, ...containerStyle }}
          >
            <div style={{ padding: 'var(--space-3)' }}>
              <LoremParagraphs count={8} />
            </div>
          </VerticalScrollArea>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
