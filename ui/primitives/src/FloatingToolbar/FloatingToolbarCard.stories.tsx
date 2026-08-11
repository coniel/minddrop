/**
 * FloatingToolbarCard.stories.tsx
 * Dev reference for the FloatingToolbarCard component.
 */
import React, { useState } from 'react';
import { registerStory } from '@minddrop/dev-tools';
import { UiIconName } from '@minddrop/ui-icons';
import { Text } from '../Text';
import { ToolbarSeparator } from '../Toolbar';
import { Tooltip } from '../Tooltip';
import { Story, StoryItem, StoryRow, StorySection } from '../dev/Story';
import { FloatingToolbar } from './FloatingToolbar';
import { FloatingToolbarCard } from './FloatingToolbarCard';

export const FloatingToolbarCardStories = () => (
  <Story title="FloatingToolbarCard">
    {/* --------------------------------------------------------
        STATES
        The card is dimmed while it is being dragged out of the
        toolbar, standing in for the item being dragged.
    -------------------------------------------------------- */}
    <StorySection
      title="States"
      description="Cards are dragged out of the toolbar and into the view to create the thing they represent. Pass dragging while a drag is in progress to dim the card."
    >
      <StoryRow>
        <StoryItem label="resting">
          <FloatingToolbarCard icon="database" />
        </StoryItem>
        <StoryItem label="dragging">
          <FloatingToolbarCard icon="database" dragging />
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        CONTENT
        Cards hold a single icon, either a UI icon or the content
        icon of the thing they create. Children cover the rest.
    -------------------------------------------------------- */}
    <StorySection
      title="Content"
      description="Use icon for a UI icon and contentIcon for the icon of the specific thing the card creates. Anything else goes in the children, which are ignored when an icon is provided."
    >
      <StoryRow>
        <StoryItem label="icon">
          <FloatingToolbarCard icon="plus" />
        </StoryItem>
        <StoryItem label="contentIcon">
          <FloatingToolbarCard contentIcon="content-icon:book:cyan" />
        </StoryItem>
        <StoryItem label="children">
          <FloatingToolbarCard>
            <Text size="sm" color="muted" stringText="42" />
          </FloatingToolbarCard>
        </StoryItem>
      </StoryRow>
    </StorySection>

    {/* --------------------------------------------------------
        IN A TOOLBAR
        Cards are laid out by the toolbar, labelled with a
        tooltip naming what they create, and dragged out of it.
    -------------------------------------------------------- */}
    <StorySection
      title="In a toolbar"
      description="Cards sit in a floating toolbar, grouped with a separator and labelled by a tooltip naming what each one creates. Drag a card to see it dim while the drag is in progress."
    >
      <StoryRow>
        <StoryItem label="drag a card">
          <FloatingToolbar visible>
            <DraggableCard
              contentIcon="content-icon:book:cyan"
              tooltip="Note"
            />

            <ToolbarSeparator />

            <DraggableCard icon="plus" tooltip="New entry" />

            <DraggableCard icon="search" tooltip="Add existing entry" />
          </FloatingToolbar>
        </StoryItem>
      </StoryRow>
    </StorySection>
  </Story>
);

interface DraggableCardProps {
  /**
   * The name of the UI icon rendered in the card.
   */
  icon?: UiIconName;

  /**
   * The stringified content icon rendered in the card.
   */
  contentIcon?: string;

  /**
   * The card's tooltip, naming what it creates.
   */
  tooltip: string;
}

/**
 * Renders a card which tracks its own drag state, standing in for
 * a consumer's drag hook.
 */
const DraggableCard: React.FC<DraggableCardProps> = ({
  icon,
  contentIcon,
  tooltip,
}) => {
  const [dragging, setDragging] = useState(false);

  // Dim the card for the duration of the drag
  function handleDragStart() {
    setDragging(true);
  }

  function handleDragEnd() {
    setDragging(false);
  }

  return (
    <Tooltip stringTitle={tooltip} side="top">
      <FloatingToolbarCard
        icon={icon}
        contentIcon={contentIcon}
        draggable
        dragging={dragging}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </Tooltip>
  );
};

registerStory({
  group: 'Layout',
  label: 'FloatingToolbarCard',
  component: FloatingToolbarCardStories,
});
