import { useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Tag, TagGroup, TagGroups, Tags, TagsIcon } from '@minddrop/tags';
import {
  ListPanelView,
  ListPanelViewItem,
  ListPanelViewSection,
} from '@minddrop/ui-components';
import { Views } from '@minddrop/views';
import { NewTagMenu } from './NewTagMenu';
import { NewTagPopover } from './NewTagPopover';
import { TagEntries } from './TagEntries';
import { TagGroupNamePopover } from './TagGroupNamePopover';
import { TagNamePopover } from './TagNamePopover';
import { buildTagGroupMenu } from './buildTagGroupMenu';
import { buildTagMenu } from './buildTagMenu';
import './TagsView.css';

/**
 * Renders a two column view of the global tags: a searchable list
 * of tags sectioned by group on the left, and the entries tagged
 * with the selected tag on the right.
 */
export const TagsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [renamingTagId, setRenamingTagId] = useState<string | null>(null);
  const [renamingGroupId, setRenamingGroupId] = useState<string | null>(null);
  const [creatingTagGroupId, setCreatingTagGroupId] = useState<string | null>(
    null,
  );
  const subview = Views.useSubview();
  const { t } = useTranslation();
  const tags = Tags.useAll();
  const groups = TagGroups.useAll();
  const selectedTag = Tags.use(subview?.id ?? '');

  // Tags listed in the left column: fuzzy name matches when
  // searching, all tags otherwise
  const listedTags = useMemo(
    () => (query ? Tags.search(query) : tags),
    [tags, query],
  );

  // The listed tags sectioned by group, ungrouped tags first
  const sections = useMemo(() => {
    // Returns the tag as a list item carrying its menu and rename
    // popover
    const toListItem = (tag: Tag): ListPanelViewItem => ({
      id: tag.id,
      label: tag.name,
      contentIcon: tag.icon,
      menu: buildTagMenu(tag, groups, () => setRenamingTagId(tag.id)),
      popovers: ({ anchor }) => (
        <TagNamePopover
          open={renamingTagId === tag.id}
          onOpenChange={(open) => setRenamingTagId(open ? tag.id : null)}
          anchor={anchor}
          tag={tag}
        />
      ),
    });

    // Collapsible group sections in alphabetical order
    const groupSections: ListPanelViewSection[] = [...groups]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((group) => ({
        id: group.id,
        stringLabel: group.name,
        menu: buildTagGroupMenu(group, {
          onCreateTag: () => setCreatingTagGroupId(group.id),
          onRename: () => setRenamingGroupId(group.id),
        }),
        popovers: ({ anchor }) => (
          <>
            {/* Renames the group */}
            <TagGroupNamePopover
              open={renamingGroupId === group.id}
              onOpenChange={(open) =>
                setRenamingGroupId(open ? group.id : null)
              }
              anchor={anchor}
              defaultName={group.name}
              onSubmit={(name) => renameGroup(group, name)}
            />

            {/* The menu's new tag form */}
            <NewTagPopover
              open={creatingTagGroupId === group.id}
              onOpenChange={(open) =>
                setCreatingTagGroupId(open ? group.id : null)
              }
              anchor={anchor}
              defaultGroup={group}
            />
          </>
        ),
        addPopover: ({ anchor, open, onOpenChange }) => (
          <NewTagPopover
            open={open}
            onOpenChange={onOpenChange}
            anchor={anchor}
            defaultGroup={group}
          />
        ),
        items: listedTags
          .filter((tag) => tag.group === group.id)
          .map(toListItem),
      }));

    // Tags without a group, or whose group no longer exists,
    // listed first
    const groupIds = new Set(groups.map((group) => group.id));
    const ungroupedItems = listedTags
      .filter((tag) => !tag.group || !groupIds.has(tag.group))
      .map(toListItem);

    // The ungrouped section is only labelled when it has tags to
    // set apart from the groups, and dropped entirely when empty
    // so the list-level empty state can show
    const ungroupedSections: ListPanelViewSection[] =
      ungroupedItems.length > 0
        ? [
            {
              id: 'ungrouped',
              stringLabel:
                groups.length > 0 ? t('tags.list.ungrouped') : undefined,
              items: ungroupedItems,
            },
          ]
        : [];

    const allSections = [...ungroupedSections, ...groupSections];

    // While searching, hide sections without matches
    return query
      ? allSections.filter((section) => section.items.length > 0)
      : allSections;
  }, [
    groups,
    listedTags,
    query,
    t,
    renamingTagId,
    renamingGroupId,
    creatingTagGroupId,
  ]);

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

  // Create a new group with the committed name, ignoring names
  // already in use
  async function handleCreateGroup(name: string) {
    try {
      await TagGroups.create(name);
    } catch {
      // A group with the name already exists
    }
  }

  return (
    <ListPanelView
      className="tags-view"
      icon={TagsIcon}
      title="tags.labels.tags"
      sections={sections}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="tags.list.searchPlaceholder"
      emptyLabel="tags.list.empty"
      noResultsLabel="tags.list.noResults"
      sectionEmptyLabel="tags.list.empty"
      noSelectionLabel="tags.details.noSelection"
      itemMenuLabel="tags.actions.options"
      sectionMenuLabel="tags.actions.groupOptions"
      sectionAddLabel="tags.actions.new"
      addAction={
        <NewTagMenu groups={groups} onCreateGroup={handleCreateGroup} />
      }
    >
      {selectedTag && <TagEntries tag={selectedTag} />}
    </ListPanelView>
  );
};

/**
 * Persists a group's new name, ignoring names already in use.
 */
async function renameGroup(group: TagGroup, name: string) {
  // The name is unchanged
  if (name === group.name) {
    return;
  }

  try {
    await TagGroups.update(group.id, { name });
  } catch {
    // The name is already in use, keep the current one
  }
}
