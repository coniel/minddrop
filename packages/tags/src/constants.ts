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
 * The type the ledger of a workspace's tags is filed under within
 * its ledgers directory.
 */
export const TagLedgerType = 'tags';

/**
 * The causes of the actions recorded in the workspace's tags ledger.
 * Persisted in the ledger files.
 */
export const TagHistoryCauses = {
  TagRenamed: 'tags:tag-renamed',
  TagDeleted: 'tags:tag-deleted',
} as const;
