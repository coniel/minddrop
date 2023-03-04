import { createItemStore } from '../createItemStore';

export interface ConfigItem {
  id: string;
  values: Record<string, any>;
}

export const PersistentConfigsStore = createItemStore<ConfigItem>();
