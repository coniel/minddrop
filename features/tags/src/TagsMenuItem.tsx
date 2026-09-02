import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { OpenTagsViewEvent, TagsIcon } from '@minddrop/tags';
import { MenuItem } from '@minddrop/ui-primitives';
import { TagsViewName } from './events';

/**
 * Renders the sidebar menu item which opens the tags view.
 */
export const TagsMenuItem: React.FC = () => {
  const active = Tabs.useIsViewActive(TagsViewName);

  // Open the tags view
  function handleClick() {
    Events.dispatch(OpenTagsViewEvent);
  }

  return (
    <MenuItem
      muted
      active={active}
      icon={TagsIcon}
      label="tags.labels.tags"
      onClick={handleClick}
    />
  );
};
