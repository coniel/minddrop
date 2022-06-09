/* eslint-disable no-underscore-dangle */
import {
  ResourceDocument,
  RDData,
  Resources,
  ResourceDeserializers,
} from '@minddrop/resources';
import { DBResourceDocument } from '../types';

const deserializers: ResourceDeserializers<{ date: string }> = {
  /**
   * Dates are stored as date string in PouchDB.
   */
  date: (value) => new Date(value),
};

/**
 * Deserializes a PouchDB resource document into its
 * original form.
 *
 * @param document - The document to deserialize.
 * @returns Deserialized document.
 */
export function deserializeResourceDocument<TData extends RDData = {}>(
  document: DBResourceDocument,
): ResourceDocument<TData> {
  const cleaned = { ...document, id: document._id };

  delete cleaned._id;
  delete cleaned._rev;
  delete cleaned._deleted;

  return Resources.deserializeDocument(
    cleaned,
    deserializers,
  ) as unknown as ResourceDocument<TData>;
}
