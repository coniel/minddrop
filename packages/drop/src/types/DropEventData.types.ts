import { Drop } from './Drop.types';

export type CreateDropEvent = 'create-drop';
export type UpdateDropEvent = 'update-drop';
export type ArchiveDropEvent = 'archive-drop';
export type UnarchiveDropEvent = 'unarchive-drop';
export type DeleteDropEvent = 'delete-drop';
export type RestoreDropEvent = 'restore-drop';

export type ArchiveDropEventData = Drop;
export type UnarchiveDropEventData = Drop;
export type DeleteDropEventData = Drop;
export type RestoreDropEventData = Drop;

export interface CreateDropEventData {
  /**
   * The drop itself.
   */
  drop: Drop;

  /**
   * The drop's files. Only set if the drop contains files.
   */
  files?: File[];
}

export interface UpdateDropEventData {
  /**
   * The drop data prior to being updated.
   */
  before: Drop;

  /**
   * The updated drop data.
   */
  after: Drop;

  /**
   * The changes made to the drop data.
   */
  changes: Partial<Drop>;

  /**
   * The drop's files. Only set if files were added to the drop during the update.
   */
  files?: File[];
}
