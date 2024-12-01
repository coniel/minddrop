import { AssetHandler } from './types';

export let AssetHandlersStore: AssetHandler[] = [];

export function clear() {
  AssetHandlersStore = [];
}

export function registerAssetHandler(handler: AssetHandler) {
  AssetHandlersStore.push(handler);
}

export function unregisterAssetHandler(id: string) {
  AssetHandlersStore = AssetHandlersStore.filter(
    (handler) => handler.id !== id,
  );
}
