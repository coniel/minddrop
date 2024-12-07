import { SelectionItemTypeNotRegisteredError } from './errors';
import { SelectionItemTypeConfig } from './types';

export const SelectionItemTypesStore = new Map<
  string,
  SelectionItemTypeConfig
>();

export function registerSelectionItemType(serializer: SelectionItemTypeConfig) {
  SelectionItemTypesStore.set(serializer.id, serializer);
}

export function getSelectionItemTypeConfig(
  serializerId: string,
): SelectionItemTypeConfig {
  const serializer = SelectionItemTypesStore.get(serializerId);

  if (!serializer) {
    throw new SelectionItemTypeNotRegisteredError(serializerId);
  }

  return serializer;
}

export function unregisterSelectionItemType(serializerId: string) {
  SelectionItemTypesStore.delete(serializerId);
}
