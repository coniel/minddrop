// The names of the errors a cancelled pdf.js render or text layout
// rejects with.
const CancellationErrorNames = [
  'RenderingCancelledException',
  'AbortException',
];

/**
 * Checks whether an error is the rejection a cancelled pdf.js render
 * or text layout ends with.
 *
 * @param error - The error.
 * @returns Whether the error is a cancellation.
 */
export function isPdfRenderCancellation(error: unknown): boolean {
  return error instanceof Error && CancellationErrorNames.includes(error.name);
}
