import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { PdfAnnotation, PdfDocumentAnnotations } from '../types';

const { workspace_1 } = WorkspaceFixtures;

// The path of the annotated document
export const pdfDocumentPath = `${workspace_1.path}/Papers/paper.pdf`;

// The path of a document without annotations
export const pdfDocumentPath_unannotated = `${workspace_1.path}/Papers/other.pdf`;

// A highlight spanning two lines
export const pdfAnnotation_1: PdfAnnotation = {
  id: 'pdf-annotation_1',
  page: 0,
  rects: [
    [72, 700, 300, 712],
    [72, 686, 180, 698],
  ],
  text: 'The first highlighted passage',
  color: 'yellow',
  created: new Date('2026-01-01T00:00:00.000Z'),
};

// A highlight with a note
export const pdfAnnotation_2: PdfAnnotation = {
  id: 'pdf-annotation_2',
  page: 3,
  rects: [[100, 400, 250, 412]],
  text: 'A second passage',
  color: 'green',
  created: new Date('2026-01-02T00:00:00.000Z'),
  note: 'Worth a second look',
};

// The annotated document's annotations
export const pdfAnnotations = [pdfAnnotation_1, pdfAnnotation_2];

// The annotated document's annotations, as stored
export const pdfDocumentAnnotations_1: PdfDocumentAnnotations = {
  path: pdfDocumentPath,
  annotations: pdfAnnotations,
};
