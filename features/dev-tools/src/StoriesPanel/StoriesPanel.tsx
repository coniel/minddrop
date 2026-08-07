import React from 'react';
import { MenuGroup, MenuItem, MenuLabel } from '@minddrop/ui-primitives';
import {
  StoryGroup,
  StoryItem,
  stories,
} from '@minddrop/ui-primitives/stories';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { StoriesPanelState } from './StoriesPanelState';
import './StoriesPanel.css';

/**
 * Renders the UI component stories, listing them by group in the
 * panel sidebar and previewing the selected story.
 */
export const StoriesPanel: React.FC = () => {
  const activeStoryId = StoriesPanelState.useValue('activeStoryId');

  // Fall back to the first story when none is selected
  const activeStory =
    getStoryById(activeStoryId) ?? stories[0]?.items[0] ?? null;
  const ActiveStory = activeStory?.component;

  const sidebar = stories.map((group) => (
    <MenuGroup key={group.group}>
      <MenuLabel stringLabel={group.group} />

      {group.items.map((item) => (
        <StoryMenuItem
          key={item.label}
          group={group}
          item={item}
          active={activeStory === item}
        />
      ))}
    </MenuGroup>
  ));

  return (
    <DevToolsPanelLayout sidebar={sidebar}>
      <div className="dev-tools-story">{ActiveStory && <ActiveStory />}</div>
    </DevToolsPanelLayout>
  );
};

interface StoryMenuItemProps {
  /**
   * The group the story belongs to.
   */
  group: StoryGroup;

  /**
   * The story the item selects.
   */
  item: StoryItem;

  /**
   * Whether the story is being previewed.
   */
  active: boolean;
}

/**
 * Renders a sidebar menu item which previews its story when clicked.
 */
const StoryMenuItem: React.FC<StoryMenuItemProps> = ({
  group,
  item,
  active,
}) => {
  const handleClick = () => {
    StoriesPanelState.set('activeStoryId', getStoryId(group, item));
  };

  return (
    <MenuItem
      size="compact"
      stringLabel={item.label}
      active={active}
      onClick={handleClick}
    />
  );
};

/**
 * Generates the ID under which a story is referenced.
 */
function getStoryId(group: StoryGroup, item: StoryItem): string {
  return `${group.group}:${item.label}`;
}

/**
 * Retrieves a story by its ID.
 *
 * @param id - The ID of the story to retrieve.
 * @returns The story or null if it does not exist.
 */
function getStoryById(id: string | null): StoryItem | null {
  // No story is referenced by a missing ID
  if (!id) {
    return null;
  }

  for (const group of stories) {
    const match = group.items.find((item) => getStoryId(group, item) === id);

    if (match) {
      return match;
    }
  }

  return null;
}
