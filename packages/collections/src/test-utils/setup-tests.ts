import { CollectionsStore } from '../CollectionsStore';

export function setup() {}

export function cleanup() {
  CollectionsStore.getState().clear();
}
