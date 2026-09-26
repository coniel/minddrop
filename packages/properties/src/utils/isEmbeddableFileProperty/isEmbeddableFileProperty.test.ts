import { describe, expect, it } from 'vitest';
import { PropertySchema } from '../../types';
import { isEmbeddableFileProperty } from './isEmbeddableFileProperty';

const imageProperty: PropertySchema = { type: 'image', name: 'Cover' };
const pdfProperty: PropertySchema = { type: 'pdf', name: 'Paper' };
const audioProperty: PropertySchema = { type: 'audio', name: 'Recording' };
const videoProperty: PropertySchema = { type: 'video', name: 'Clip' };
const fileProperty: PropertySchema = { type: 'file', name: 'Attachment' };
const textProperty: PropertySchema = { type: 'text', name: 'Summary' };

describe('isEmbeddableFileProperty', () => {
  it('accepts image, pdf, audio and video properties', () => {
    expect(isEmbeddableFileProperty(imageProperty)).toBe(true);
    expect(isEmbeddableFileProperty(pdfProperty)).toBe(true);
    expect(isEmbeddableFileProperty(audioProperty)).toBe(true);
    expect(isEmbeddableFileProperty(videoProperty)).toBe(true);
  });

  it('rejects generic file properties', () => {
    expect(isEmbeddableFileProperty(fileProperty)).toBe(false);
  });

  it('rejects properties which hold no file', () => {
    expect(isEmbeddableFileProperty(textProperty)).toBe(false);
  });
});
