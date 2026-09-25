import { describe, expect, it } from 'vitest';
import { PropertySchema } from '../../types';
import { isEmbeddableFileProperty } from './isEmbeddableFileProperty';

const imageProperty: PropertySchema = { type: 'image', name: 'Cover' };
const pdfProperty: PropertySchema = { type: 'pdf', name: 'Paper' };
const fileProperty: PropertySchema = { type: 'file', name: 'Attachment' };
const textProperty: PropertySchema = { type: 'text', name: 'Summary' };

describe('isEmbeddableFileProperty', () => {
  it('accepts image and pdf properties', () => {
    expect(isEmbeddableFileProperty(imageProperty)).toBe(true);
    expect(isEmbeddableFileProperty(pdfProperty)).toBe(true);
  });

  it('rejects generic file properties', () => {
    expect(isEmbeddableFileProperty(fileProperty)).toBe(false);
  });

  it('rejects properties which hold no file', () => {
    expect(isEmbeddableFileProperty(textProperty)).toBe(false);
  });
});
