import { createVanillaStore } from '@minddrop/stores';
import { PdfReader } from './types';

interface PdfReadersState {
  /**
   * The mounted readers, in mount order.
   */
  readers: PdfReader[];
}

// The mounted readers showing documents
export const PdfReadersStore = createVanillaStore<PdfReadersState>(() => ({
  readers: [],
}));
