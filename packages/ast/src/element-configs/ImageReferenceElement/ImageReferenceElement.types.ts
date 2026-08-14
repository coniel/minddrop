import { Element } from '../../types';
import { ReferenceType } from '../LinkReferenceElement';

export interface ImageReferenceElementData {
  /**
   * The normalized identifier the reference resolves against.
   */
  identifier: string;

  /**
   * The label as authored.
   */
  label?: string;

  /**
   * The image's alternative text.
   */
  alt?: string | null;

  /**
   * The reference's authored form.
   */
  referenceType: ReferenceType;
}

export type ImageReferenceElement = Element<
  'image-reference',
  ImageReferenceElementData
>;
