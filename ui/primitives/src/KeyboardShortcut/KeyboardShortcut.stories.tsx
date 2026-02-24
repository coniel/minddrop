/**
 * KeyboardShortcut.stories.tsx
 * Dev reference for the KeyboardShortcut component.
 */
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { KeyboardShortcut } from './KeyboardShortcut';

export const KeyboardShortcutStories = () => (
  <Story title="KeyboardShortcut">
    {/* --------------------------------------------------------
        BASIC
        Renders an array of key names as a shortcut string.
        Use 'Mod' for the primary modifier — it renders as ⌘
        on Mac and Ctrl on Windows/Linux.
    -------------------------------------------------------- */}
    <StorySection
      title="Basic"
      description="Pass key names as an array. Use 'Mod' for the cross-platform primary modifier key."
    >
      <StoryRow>
        <StoryItem label="['Mod', 'S']">
          <KeyboardShortcut keys={['Mod', 'S']} />
        </StoryItem>
        <StoryItem label="['Mod', 'Shift', 'P']">
          <KeyboardShortcut keys={['Mod', 'Shift', 'P']} />
        </StoryItem>
        <StoryItem label="['Mod', 'Alt', 'T']">
          <KeyboardShortcut keys={['Mod', 'Alt', 'T']} />
        </StoryItem>
        <StoryItem label="['Enter']">
          <KeyboardShortcut keys={['Enter']} />
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        IN CONTEXT
        KeyboardShortcut inherits Text props, so it can be
        sized and colored to match its container.
    -------------------------------------------------------- */}
    <StorySection
      title="In context"
      description="Inherits Text props — size and color it to match its container. Muted or subtle colors are typical."
    >
      <StoryRow>
        <StoryItem label="default">
          <KeyboardShortcut keys={['Mod', 'K']} />
        </StoryItem>
        <StoryItem label="muted">
          <KeyboardShortcut keys={['Mod', 'K']} color="muted" />
        </StoryItem>
        <StoryItem label="subtle">
          <KeyboardShortcut keys={['Mod', 'K']} color="subtle" />
        </StoryItem>
        <StoryItem label="xs">
          <KeyboardShortcut keys={['Mod', 'K']} size="xs" color="muted" />
        </StoryItem>
        <StoryItem label="sm">
          <KeyboardShortcut keys={['Mod', 'K']} size="sm" color="muted" />
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
