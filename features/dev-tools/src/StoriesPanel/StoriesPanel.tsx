import React, { useCallback, useMemo, useState } from 'react';
import {
  StoryGroup,
  StoryItem,
  filterStories,
  useStories,
} from '@minddrop/dev-tools';
import {
  MenuGroup,
  MenuItem,
  MenuLabel,
  TextInput,
} from '@minddrop/ui-primitives';
import { DevToolsPanelLayout } from '../DevToolsPanelLayout';
import { StoriesPanelState } from './StoriesPanelState';
import './StoriesPanel.css';

/**
 * Renders the registered component stories, listing them by group
 * in the panel sidebar and previewing the selected story.
 */
export const StoriesPanel: React.FC = () => {
  const [search, setSearch] = useState('');
  const activeStoryId = StoriesPanelState.useValue('activeStoryId');
  const groups = useStories();

  const listedGroups = useMemo(
    () => filterStories(groups, search),
    [groups, search],
  );

  // Selected from all stories rather than the listed ones, so that
  // the previewed story stays put while searching
  const activeStory =
    getStoryById(groups, activeStoryId) ?? groups[0]?.items[0] ?? null;
  const ActiveStory = activeStory?.component;

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const sidebar = (
    <>
      <div className="dev-tools-stories-search">
        <TextInput
          size="sm"
          placeholder="devTools.stories.searchPlaceholder"
          value={search}
          clearable
          unassisted
          onChange={handleSearchChange}
          onClear={handleClearSearch}
        />
      </div>

      {listedGroups.map((group) => (
        <MenuGroup key={group.group} className="dev-tools-stories-group">
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
      ))}
    </>
  );

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
 * @param groups - The story groups to search.
 * @param id - The ID of the story to retrieve.
 * @returns The story or null if it does not exist.
 */
function getStoryById(
  groups: StoryGroup[],
  id: string | null,
): StoryItem | null {
  // No story is referenced by a missing ID
  if (!id) {
    return null;
  }

  for (const group of groups) {
    const match = group.items.find((item) => getStoryId(group, item) === id);

    if (match) {
      return match;
    }
  }

  return null;
}
