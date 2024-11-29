import { Events } from '@minddrop/events';
import { BlockClassifiersStore } from '../BlockClassifiersStore';
import { BlockVariantsStore } from '../BlockVariantsStore';
import { BlocksStore } from '../BlocksStore';

export function setup() {}

export function cleanup() {
  BlockClassifiersStore.clear();
  BlockVariantsStore.clear();
  BlocksStore.getState().clear();

  // Clear all event listeners
  Events._clearAll();
}
