import { FieldValueArrayUnion, FieldValueArrayRemove } from '@minddrop/utils';
import { ResourceDocument, RDChanges } from '@minddrop/resources';

export interface RTDocumentData {
  /**
   * The IDs of the `RTElement`s which make up the content
   * of the document.
   */
  children: string[];
}

export type RTDocument = ResourceDocument<RTDocumentData>;

/**
 * A { [id]: RTDocument } map of rich text documents.
 */
export type RTDocumentMap = Record<string, RTDocument>;

/**
 * Data supplied when creating a new rich text document.
 */
export interface CreateRTDocumentData {
  /**
   * The IDs of the `RTElement`s which make up the content
   * of the document.
   */
  children?: string[];
}

export type UpdateRTDocumentData = {
  /**
   * The IDs of the `RTElement`s which make up the content
   * of the document.
   */
  children?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;

  /**
   * The document revision ID. If omitted, a new revision ID
   * is automatically genereated.
   */
  revision?: string;
};

export type RTDocumentChanges = RDChanges<{
  /**
   * The IDs of the `RTElement`s which make up the content
   * of the document.
   */
  children?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
}>;
