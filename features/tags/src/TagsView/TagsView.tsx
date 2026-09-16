import { useMemo, useState } from 'react';
import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { TagGroups, Tags } from '@minddrop/tags';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import { EntityGroupAddAction } from '@minddrop/ui-entity-groups';
import { orderByName } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { NewTagMenu } from './NewTagMenu';
import { NewTagPopover } from './NewTagPopover';
import { TagEntries } from './TagEntries';
import { TagNamePopover } from './TagNamePopover';
import { buildTagMenu } from './buildTagMenu';
import './TagsView.css';

/**
 * Renders a two column view of the global tags: a searchable list
 * of tags grouped by tag group on the left, and the entries tagged
 * with the selected tag on the right.
 */
export const TagsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [renamingTagId, setRenamingTagId] = useState<string | null>(null);
  const subview = Views.useSubview();
  const tags = Tags.useAll();
  const groups = TagGroups.useAll();
  const selectedTag = Tags.use(subview?.id ?? '');

  // List the tags for the left column. Matches in match order while
  // searching, every tag by name otherwise.
  const listedTags = useMemo(
    () => (query ? Tags.search(query) : [...tags].sort(orderByName)),
    [tags, query],
  );

  // Build the listed tags into rows with their menu and rename
  // popover.
  const items = useMemo(
    () =>
      listedTags.map(
        (tag): ListPanelViewItem => ({
          id: tag.id,
          label: tag.name,
          contentIcon: tag.icon,
          menu: buildTagMenu(
            tag,
            groups,
            TagGroups.getForItem(tag.id)[0]?.id ?? null,
            () => setRenamingTagId(tag.id),
          ),
          popovers: ({ anchor }) => (
            <TagNamePopover
              open={renamingTagId === tag.id}
              onOpenChange={(open) => setRenamingTagId(open ? tag.id : null)}
              anchor={anchor}
              tag={tag}
            />
          ),
        }),
      ),
    [listedTags, groups, renamingTagId],
  );

  // The tag whose entries the panel's content lists
  const selectedItem = useMemo(
    () =>
      selectedTag && {
        id: selectedTag.id,
        label: selectedTag.name,
        contentIcon: selectedTag.icon,
      },
    [selectedTag],
  );

  return (
    <ListPanelView
      className="tags-view"
      icon={Tags.constants.Icon}
      title="tags.labels.tags"
      items={items}
      groups={{
        type: TagGroups.constants.Type,
        resolveAddAction: resolveGroupAddAction,
      }}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="tags.list.searchPlaceholder"
      emptyLabel="tags.list.empty"
      noResultsLabel="tags.list.noResults"
      noSelectionLabel="tags.details.noSelection"
      itemMenuLabel="tags.actions.options"
      addAction={<NewTagMenu groups={groups} />}
    >
      {selectedTag && <TagEntries tag={selectedTag} />}
    </ListPanelView>
  );
};

/**
 * Returns the add control shown in a group's label row. It creates a
 * tag filed under the group, with no group field on its form. The
 * group it was opened from is the tag's.
 */
function resolveGroupAddAction(group: EntityGroup): EntityGroupAddAction {
  // A tag created from the ungrouped group joins no group
  const defaultGroup =
    group.id === EntityGroups.constants.UngroupedId ? undefined : group;

  // Build the add button and the form it opens
  return {
    label: 'tags.actions.new',
    popover: ({ anchor, open, onOpenChange }) => (
      <NewTagPopover
        hideGroupField
        open={open}
        onOpenChange={onOpenChange}
        anchor={anchor}
        defaultGroup={defaultGroup}
      />
    ),
  };
}
