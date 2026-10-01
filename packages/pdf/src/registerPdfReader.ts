import { PdfReadersStore } from './PdfReadersStore';
import { PdfReader } from './types';

/**
 * Records a mounted reader showing a document.
 *
 * @param reader - The reader.
 * @returns A function removing the reader.
 */
export function registerPdfReader(reader: PdfReader): VoidFunction {
  // Add the reader
  PdfReadersStore.setState((state) => ({
    readers: [...state.readers, reader],
  }));

  // Return a function removing the reader
  return () => {
    PdfReadersStore.setState((state) => ({
      readers: state.readers.filter((candidate) => candidate !== reader),
    }));
  };
}
