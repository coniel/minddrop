import { createItemStore } from '../createItemStore';

export interface ConfigItem {
  id: string;
  values: Record<string, unknown>;
}

export const PersistentConfigsStore = createItemStore<ConfigItem>();
