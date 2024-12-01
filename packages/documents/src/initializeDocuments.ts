import { Assets } from '@minddrop/assets';
import { DocumentAssetsHandler } from './DocumentAssetsHandler';

export function initializeDocuments() {
  // Register an asset handler to handle document view and
  // block assets.
  Assets.registerHandler(DocumentAssetsHandler);
}
