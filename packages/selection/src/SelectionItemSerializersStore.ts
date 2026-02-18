import { SelectionItemSerializer } from './types';

export const SelectionItemSerializersStore = new Map<
  string,
  SelectionItemSerializer
>();

/**
 * Registers a selection item type with the store.
 *
 * @param selectionItemType - The selection item type to register.
 * @throws {SelectionItemTypeNotRegisteredError} If the selection item type
 * is already registered.
 */
export function registerSelectionItemSerializer(
  selectionItemType: SelectionItemSerializer,
) {
  SelectionItemSerializersStore.set(selectionItemType.type, selectionItemType);
}

/**
 * Retrieves a selection item type from the store by type.
 *
 * @param type - The tyoe of the selection item type to retrieve.
 * @returns The selection item type or null if it doesn't exist.
 */
export function getSelectionItemSerializer(
  type: string,
): SelectionItemSerializer | null {
  const serializer = SelectionItemSerializersStore.get(type);

  return serializer || null;
}

/**
 * Unregisters a selection item type from the store.
 *
 * @param serializerId - The ID of the selection item type to unregister.
 */
export function unregisterSelectionItemSerializer(serializerId: string) {
  SelectionItemSerializersStore.delete(serializerId);
}
