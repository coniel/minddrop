import { PdfAnnotationNotFoundError } from '../errors';
import { getPdfAnnotations } from '../getPdfAnnotations';
import { PdfAnnotation } from '../types';

/**
 * Retrieves one of a document's annotations.
 *
 * @param path - The absolute path of the PDF file.
 * @param id - The ID of the annotation.
 * @param throwOnNotFound - Whether to throw when the annotation does not exist.
 * @returns The annotation, or null when not found and not throwing.
 *
 * @throws {PdfAnnotationNotFoundError} If the annotation does not exist and throwing is enabled.
 */
export function getPdfAnnotation(path: string, id: string): PdfAnnotation;
export function getPdfAnnotation(
  path: string,
  id: string,
  throwOnNotFound: false,
): PdfAnnotation | null;
export function getPdfAnnotation(
  path: string,
  id: string,
  throwOnNotFound = true,
): PdfAnnotation | null {
  // Find the annotation among the document's annotations
  const annotation = getPdfAnnotations(path).find(
    (candidate) => candidate.id === id,
  );

  // Throw if the annotation does not exist and throwing is enabled
  if (!annotation && throwOnNotFound) {
    throw new PdfAnnotationNotFoundError(path, id);
  }

  return annotation ?? null;
}
