import type { UiIconName } from '@minddrop/ui-icons';

/**
 * The entity type of tags, prefixing their IDs.
 */
export const TagEntityType = 'tag';

/**
 * The entity group type tag groups are registered as.
 */
export const TagGroupsType = 'tag-groups';

export const TagsDirName = 'tags';
export const TagFileExtension = 'json';

/**
 * The icon used to represent tags in the UI.
 */
export const TagsIcon: UiIconName = 'tag';

/**
 * The icon used to represent tag groups in the UI.
 */
export const TagGroupsIcon: UiIconName = 'tags';

/**
 * The default icon assigned to newly created tags.
 */
export const DefaultTagIcon = 'lucide:tag:default';

/**
 * The causes a tag action names on the history records it makes.
 * Persisted in history files.
 */
export const TagHistoryCauses = {
  TagRenamed: 'tags:tag-renamed',
  TagDeleted: 'tags:tag-deleted',
} as const;
