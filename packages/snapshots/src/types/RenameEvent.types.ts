export type RenameEventKind = 'entry' | 'database' | 'property' | 'tag';

export interface RenameEvent {
  /**
   * When the rename happened.
   */
  timestamp: Date;

  /**
   * The renamed entity's address before the rename.
   */
  from: string;

  /**
   * The renamed entity's address after the rename.
   */
  to: string;

  /**
   * The kind of entity that was renamed. Database events are
   * replayed as a prefix rewrite covering every address beneath
   * the database.
   */
  kind: RenameEventKind;

  /**
   * The renamed entity's fixed ID, present for kinds whose
   * entities carry one. Used to disambiguate chains when a
   * deleted entity's name is later reused; chain matching itself
   * stays address-based.
   */
  entityId?: string;
}
