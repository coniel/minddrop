import { FieldValueArrayRemove, FieldValueArrayUnion } from '@minddrop/utils';
import { ResourceDocument } from '@minddrop/resources';

export interface ExtensionDocumentData {
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

export interface CreateExtensionDocumentData {
  /**
   * The ID of the extension.
   */
  extension: string;
}

export interface UpdateExtensionDocumentData {
  enabled?: boolean;
  topics?: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
}

export type ExtensionDocument = ResourceDocument<ExtensionDocumentData>;
