import { Item, ItemCoreProperties } from '../types';

export function itemCoreProperties(item: Item): ItemCoreProperties {
  return {
    title: item.title,
    created: item.created,
    lastModified: item.lastModified,
  };
}
