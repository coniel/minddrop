import { PropertyValue } from '@minddrop/properties';
import { DistributiveOmit } from '@minddrop/utils';

export interface PropertyChange {
  /**
   * The name of the property that changed.
   */
  property: string;

  /**
   * The value the property held before the change.
   */
  from: PropertyValue;

  /**
   * The value the property was changed to.
   */
  to: PropertyValue;
}

interface BaseHistoryRecord {
  /**
   * When the change happened.
   */
  timestamp: Date;

  /**
   * The automation run the change was made during, present only for
   * changes made by one. Groups a run's records into the set
   * reverting it restores.
   */
  runId?: string;
}

export interface CreatedRecord extends BaseHistoryRecord {
  kind: 'created';
}

export interface PropertyRecord extends BaseHistoryRecord {
  kind: 'property';

  /**
   * The properties changed by one action, recorded together so the
   * log reads as what happened rather than as unrelated edits.
   */
  changes: PropertyChange[];
}

export interface ContentRecord extends BaseHistoryRecord {
  kind: 'content';

  /**
   * The name of the file holding the content, within the subject's
   * content directory. A name rather than a path, so that the record
   * survives its history being moved.
   */
  file: string;

  /**
   * Hash of the stored content, so that a capture policy can tell
   * whether the subject has changed since its last capture without
   * reading the content back.
   */
  contentHash: string;
}

/**
 * The kind of thing that was renamed.
 *
 * - `self`, the subject itself.
 * - `reference`, an entity the subject references.
 * - `property`, a property the subject records values for.
 * - `value-label`, the label of a value a property holds, such as a
 *   tag or a select option.
 */
export type RenameTarget = 'self' | 'reference' | 'property' | 'value-label';

interface BaseRenameRecord extends BaseHistoryRecord {
  kind: 'rename';

  /**
   * The name before the rename.
   */
  from: string;

  /**
   * The name after the rename.
   */
  to: string;
}

export interface EntityRenameRecord extends BaseRenameRecord {
  /**
   * The kind of thing that was renamed.
   */
  target: Exclude<RenameTarget, 'value-label'>;
}

export interface ValueLabelRenameRecord extends BaseRenameRecord {
  /**
   * The kind of thing that was renamed.
   */
  target: 'value-label';

  /**
   * The property holding the renamed value.
   */
  property: string;
}

export type RenameRecord = EntityRenameRecord | ValueLabelRenameRecord;

export interface DeletedRecord extends BaseHistoryRecord {
  kind: 'deleted';
}

export type HistoryRecord =
  | CreatedRecord
  | PropertyRecord
  | ContentRecord
  | RenameRecord
  | DeletedRecord;

export type HistoryRecordKind = HistoryRecord['kind'];

/**
 * A change as it is handed over to be recorded. This is its record
 * minus the timestamp, which is added when the record is written.
 *
 * A content change is the exception. It is given the contents
 * themselves, and the stored file and its hash are derived from them.
 */
export type HistoryRecordInput =
  | DistributiveOmit<Exclude<HistoryRecord, ContentRecord>, 'timestamp'>
  | (Omit<ContentRecord, 'timestamp' | 'file' | 'contentHash'> & {
      /**
       * The contents to store.
       */
      contents: string;

      /**
       * The file extension to store them under, so that a snapshot
       * of them keeps the subject's own format.
       */
      extension: string;
    });

export interface HistorySubject {
  /**
   * The absolute path of the directory whose history the record
   * belongs to.
   */
  ownerPath: string;

  /**
   * The subject's key within the owner.
   */
  subjectKey: string;
}

export type RecordHistoryOptions = HistorySubject & HistoryRecordInput;

export type ContentRecordOptions = RecordHistoryOptions & { kind: 'content' };
