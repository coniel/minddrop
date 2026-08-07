import { RegisteredStore } from '@minddrop/stores';
import { RegisteredStoreGroup } from '../../types';

/**
 * Groups registered stores by the namespace their names start
 * with, sorting the groups and their stores by name.
 *
 * @param stores - The registered stores to group.
 * @returns A group per namespace.
 */
export function groupRegisteredStores(
  stores: RegisteredStore[],
): RegisteredStoreGroup[] {
  const groups = new Map<string, RegisteredStore[]>();

  for (const store of stores) {
    const namespace = getStoreNamespace(store.name);
    const namespaceStores = groups.get(namespace);

    if (namespaceStores) {
      namespaceStores.push(store);
    } else {
      groups.set(namespace, [store]);
    }
  }

  return [...groups.entries()]
    .map(([namespace, namespaceStores]) => ({
      namespace,
      stores: [...namespaceStores].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.namespace.localeCompare(b.namespace));
}

/**
 * Returns the namespace part of a store name, which is the whole
 * name for stores without one.
 */
function getStoreNamespace(name: string): string {
  const [namespace] = name.split(':');

  return namespace;
}
