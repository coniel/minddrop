import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Tag, TagGroup, TagGroups, Tags, TagsIcon } from '@minddrop/tags';
import {
  ListPanelView,
  ListPanelViewItem,
  ListPanelViewSection,
} from '@minddrop/ui-components';
import { Views } from '@minddrop/views';
import { NewTagMenu } from './NewTagMenu';
import { TagDetails } from './TagDetails';
import { TagGroupActions } from './TagGroupActions';
import './TagsView.css';

/**
 * Renders a two column view of the global tags: a searchable list
 * of tags sectioned by group on the left, and the selected tag's
 * details on the right.
 */
export const TagsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [draftTagId, setDraftTagId] = useState<string | null>(null);
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
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

  // Create a new tag with a unique default name, optionally into
  // a group, and show it as a draft to be named
  const handleCreateTag = useCallback(
    async (group?: TagGroup) => {
      const tag = await Tags.create(
        Tags.resolveUniqueName(
          t('tags.defaults.tagName'),
          tags.map((existing) => existing.name),
        ),
        undefined,
        group?.id,
      );

      setDraftTagId(tag.id);
      setSubview({ id: tag.id });
    },
    [tags, t, setSubview],
  );

  // The listed tags sectioned by group, ungrouped tags first
  const sections = useMemo(() => {
    // Collapsible group sections in alphabetical order
    const groupSections: ListPanelViewSection[] = [...groups]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((group) => ({
        id: group.id,
        stringLabel: group.name,
        actions: (
          <TagGroupActions
            group={group}
            onCreateTag={() => handleCreateTag(group)}
          />
        ),
        showLabelActionsOnHover: false,
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
  }, [groups, listedTags, query, t, handleCreateTag]);

  // The tag rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedTag && toListItem(selectedTag),
    [selectedTag],
  );

  // End the draft naming state
  function handleNameCommit() {
    setDraftTagId(null);
  }

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
      addAction={
        <NewTagMenu
          groups={groups}
          onCreateTag={handleCreateTag}
          onCreateGroup={handleCreateGroup}
        />
      }
    >
      {selectedTag && (
        <TagDetails
          tag={selectedTag}
          draft={selectedTag.id === draftTagId}
          onNameCommit={handleNameCommit}
        />
      )}
    </ListPanelView>
  );
};

/**
 * Returns the tag as a list item.
 */
function toListItem(tag: Tag): ListPanelViewItem {
  return {
    id: tag.id,
    label: tag.name,
    contentIcon: tag.icon,
  };
}
