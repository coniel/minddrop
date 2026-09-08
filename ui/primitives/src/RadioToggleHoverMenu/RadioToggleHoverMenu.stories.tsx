/**
 * RadioToggleHoverMenu.stories.tsx
 * Dev reference for the RadioToggleHoverMenu component.
 */
import { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { FloatingToolbar } from '../FloatingToolbar';
import { Toggle } from '../Toggle';
import { ToggleSize } from '../Toggle';
import { ToolbarSeparator } from '../Toolbar';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import {
  RadioToggleHoverMenu,
  RadioToggleHoverMenuOption,
} from './RadioToggleHoverMenu';

const AlignOptions: RadioToggleHoverMenuOption<string>[] = [
  { value: 'left', icon: 'align-left', label: 'Align left' },
  { value: 'center', icon: 'align-center', label: 'Align center' },
  { value: 'right', icon: 'align-right', label: 'Align right' },
  { value: 'justify', icon: 'align-justify', label: 'Justify' },
];

const PinOptions: RadioToggleHoverMenuOption<string>[] = [
  { value: 'fluid', icon: 'unfold-horizontal', label: 'Fluid width' },
  { value: 'left', icon: 'arrow-left-to-line', label: 'Pinned left' },
  {
    value: 'center',
    icon: 'align-horizontal-space-around',
    label: 'Centered',
  },
  { value: 'right', icon: 'arrow-right-to-line', label: 'Pinned right' },
];

export const RadioToggleHoverMenuStories = () => {
  const [align, setAlign] = useState('left');
  const [pin, setPin] = useState('fluid');
  const [wrapped, setWrapped] = useState(false);

  return (
    <Story title="RadioToggleHoverMenu">
      {/* --------------------------------------------------------
          BASIC
          Built for a vertical floating toolbar, whose surface the
          options continue when they open.
      -------------------------------------------------------- */}
      <StorySection
        title="Basic"
        description="A RadioToggleGroup held behind a trigger showing the selected option's icon. Resting the pointer on the trigger reaches the options out of the toolbar to its right, where they stay while the pointer is on either or in the invisible margin around them. Choosing an option leaves them open, so several can be tried in a row. Built for a vertical floating toolbar: the options carry its surface and the junction is rounded into it."
      >
        <StoryRow>
          <StoryItem label="in a toolbar">
            <ToolbarHost>
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
              <RadioToggleHoverMenu
                options={PinOptions}
                value={pin}
                label="Width"
                onValueChange={setPin}
              />
              <ToolbarSeparator />
              <Toggle
                icon="text-wrap"
                label="Wrap text"
                pressed={wrapped}
                onPressedChange={setWrapped}
              />
            </ToolbarHost>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          TOOLBAR ENDS
          A menu at either end shares a straight edge with the
          toolbar, so it drops that fillet and squares the corner.
      -------------------------------------------------------- */}
      <StorySection
        title="Toolbar ends"
        description="A menu between the toolbar's ends rounds the junction on both sides. One sitting at an end runs flush with it instead, dropping that fillet and squaring the toolbar's corner for as long as it is open."
      >
        <StoryRow>
          <StoryItem label="first">
            <ToolbarHost>
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
              <Toggle icon="bold" label="Bold" />
              <Toggle icon="italic" label="Italic" />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="between">
            <ToolbarHost>
              <Toggle icon="bold" label="Bold" />
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
              <Toggle icon="italic" label="Italic" />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="last">
            <ToolbarHost>
              <Toggle icon="bold" label="Bold" />
              <Toggle icon="italic" label="Italic" />
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="alone">
            <ToolbarHost>
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SIDE
          A toolbar against the viewport's right edge reaches its
          options out to the left instead.
      -------------------------------------------------------- */}
      <StorySection
        title="Side"
        description="The options reach out to the right by default. A toolbar standing against the viewport's right edge sets side to left, which mirrors the junction onto the toolbar's other edge."
      >
        <StoryRow>
          <StoryItem label="right (default)">
            <ToolbarHost>
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="left">
            <ToolbarHost>
              <RadioToggleHoverMenu
                side="left"
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          SIZES
      -------------------------------------------------------- */}
      <StorySection
        title="Sizes"
        description="The size applies to both the trigger and the options, and wants to match the host toolbar's so the two line up."
      >
        <StoryRow>
          <StoryItem label="sm">
            <ToolbarHost size="sm">
              <RadioToggleHoverMenu
                size="sm"
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="md (default)">
            <ToolbarHost>
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="lg">
            <ToolbarHost size="lg">
              <RadioToggleHoverMenu
                size="lg"
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          VARIANTS
      -------------------------------------------------------- */}
      <StorySection
        title="Trigger variants"
        description="The trigger takes the IconButton variants. Subtle, matching Toggle, is the default."
      >
        <StoryRow>
          <StoryItem label="ghost">
            <ToolbarHost>
              <RadioToggleHoverMenu
                variant="ghost"
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="subtle (default)">
            <ToolbarHost>
              <RadioToggleHoverMenu
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
          <StoryItem label="outline">
            <ToolbarHost>
              <RadioToggleHoverMenu
                variant="outline"
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
        </StoryRow>
      </StorySection>

      {/* --------------------------------------------------------
          DISABLED
      -------------------------------------------------------- */}
      <StorySection title="Disabled">
        <StoryRow>
          <StoryItem label="disabled">
            <ToolbarHost>
              <RadioToggleHoverMenu
                disabled
                options={AlignOptions}
                value={align}
                label="Alignment"
                onValueChange={setAlign}
              />
            </ToolbarHost>
          </StoryItem>
        </StoryRow>
      </StorySection>
    </Story>
  );
};

interface ToolbarHostProps {
  /**
   * Size of the toolbar's surface.
   */
  size?: ToggleSize;

  /**
   * The toolbar's controls.
   */
  children: React.ReactNode;
}

/**
 * Renders the vertical floating toolbar the menu is built for, so
 * the demos show the options continuing a real surface.
 */
const ToolbarHost: React.FC<ToolbarHostProps> = ({ size = 'md', children }) => (
  <FloatingToolbar size={size} visible orientation="vertical">
    {children}
  </FloatingToolbar>
);

registerStory({
  group: 'Fields',
  label: 'RadioToggleHoverMenu',
  component: RadioToggleHoverMenuStories,
});
