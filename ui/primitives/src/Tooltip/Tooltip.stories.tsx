/**
 * Tooltip.stories.tsx
 * Dev reference for the Tooltip component.
 */
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { Tooltip } from './Tooltip';

export const TooltipStories = () => (
  <Story title="Tooltip">
    {/* --------------------------------------------------------
        BASIC
        Dark tooltip on both light and dark themes for
        consistent high contrast. Title is the primary label,
        typically the name of the action.
    -------------------------------------------------------- */}
    <StorySection
      title="Basic"
      description="Dark tooltip on both themes. Hover each example to preview."
    >
      <StoryRow>
        <StoryItem label="title only">
          <Tooltip title="Copy to clipboard">
            <Button variant="filled">Hover me</Button>
          </Tooltip>
        </StoryItem>
        <StoryItem label="title + description">
          <Tooltip
            title="Publish"
            description="Make this document visible to all members"
          >
            <Button variant="filled">Hover me</Button>
          </Tooltip>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        KEYBOARD SHORTCUT
        Displayed below the title/description in a muted color.
        Use 'Mod' to render platform-appropriate modifier key.
    -------------------------------------------------------- */}
    <StorySection
      title="Keyboard shortcut"
      description="Use 'Mod' for the platform modifier key — renders ⌘ on Mac, Ctrl on Windows/Linux."
    >
      <StoryRow>
        <StoryItem label="title + shortcut">
          <Tooltip title="Save" keyboardShortcut={['Mod', 'S']}>
            <Button variant="filled">Hover me</Button>
          </Tooltip>
        </StoryItem>
        <StoryItem label="title + description + shortcut">
          <Tooltip
            title="Export"
            description="Download as PDF or image"
            keyboardShortcut={['Mod', 'Shift', 'E']}
          >
            <Button variant="filled">Hover me</Button>
          </Tooltip>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        PLACEMENT
        Defaults to bottom-center. Use side and align props
        to control placement relative to the trigger.
    -------------------------------------------------------- */}
    <StorySection
      title="Placement"
      description="Defaults to bottom-center. Adjust side and align for constrained layouts."
    >
      <StoryRow>
        <StoryItem label="bottom (default)">
          <Tooltip title="Bottom tooltip" side="bottom">
            <Button variant="filled">Bottom</Button>
          </Tooltip>
        </StoryItem>
        <StoryItem label="top">
          <Tooltip title="Top tooltip" side="top">
            <Button variant="filled">Top</Button>
          </Tooltip>
        </StoryItem>
        <StoryItem label="right">
          <Tooltip title="Right tooltip" side="right">
            <Button variant="filled">Right</Button>
          </Tooltip>
        </StoryItem>
        <StoryItem label="left">
          <Tooltip title="Left tooltip" side="left">
            <Button variant="filled">Left</Button>
          </Tooltip>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        WITH ICON BUTTON
        The most common use case — every IconButton should have
        a tooltip via its label prop, but Tooltip can be used
        directly when more control is needed.
    -------------------------------------------------------- */}
    <StorySection
      title="With IconButton"
      description="IconButton's label prop wires up the tooltip automatically. Use Tooltip directly only when you need description or shortcut."
    >
      <StoryRow>
        <StoryItem label="via label prop (auto)">
          <IconButton variant="filled" icon="settings" label="Settings" />
        </StoryItem>
        <StoryItem label="via Tooltip (manual)">
          <Tooltip
            title="Settings"
            description="Manage workspace preferences"
            keyboardShortcut={['Mod', ',']}
          >
            <IconButton variant="filled" icon="settings" label="Settings" />
          </Tooltip>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);
