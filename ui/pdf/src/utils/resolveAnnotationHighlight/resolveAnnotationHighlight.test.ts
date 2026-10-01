import { describe, expect, it } from 'vitest';
import { PdfAnnotationFixtures } from '@minddrop/pdf/test-utils';
import { resolveAnnotationHighlight } from './resolveAnnotationHighlight';

const { pdfAnnotation_1 } = PdfAnnotationFixtures;

describe('resolveAnnotationHighlight', () => {
  it('resolves the highlight drawn for the annotation', () => {
    expect(resolveAnnotationHighlight(pdfAnnotation_1)).toEqual({
      id: pdfAnnotation_1.id,
      page: pdfAnnotation_1.page,
      rects: pdfAnnotation_1.rects,
      color: pdfAnnotation_1.color,
    });
  });

  it('leaves out the fields a highlight does not draw', () => {
    expect(resolveAnnotationHighlight(pdfAnnotation_1)).not.toHaveProperty(
      'text',
    );
  });
});
