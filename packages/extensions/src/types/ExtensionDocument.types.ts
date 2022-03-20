import { FieldValueArrayRemove, FieldValueArrayUnion } from '@minddrop/utils';

export interface ExtensionDocument {
  /**
   * The document ID.
   */
  id: string;

  /**
   * The ID of the extension.
   */
  extension: string;

  /**
   * `false` if the extension is installed but disabled.
   */
  enabled: boolean;

  /**
   * The IDs of the topics in which the extension is enabled.
   */
  topics: string[];
}

export interface UpdateExtensionDocumentData {
  enabled?: boolean;
  topics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
}
