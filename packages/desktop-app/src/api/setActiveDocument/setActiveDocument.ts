import { AppUiState } from '../../AppUiState';

/**
 * Sets the given document ID as the active document ID.
 *
 * @param id - The document ID.
 */
export function setActiveDocument(id: string): void {
  AppUiState.set('view', 'document');
  AppUiState.set('activeDocumentId', id);
}
