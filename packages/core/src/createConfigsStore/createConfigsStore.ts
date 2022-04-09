import createStore from 'zustand';
import { ConfigStore } from '../types';

interface Store<TConfig> {
  /**
   * An array or registered configs.
   */
  configs: TConfig[];

  /**
   * Adds a config to the store.
   *
   * @param config The config to set.
   */
  addConfig(config: TConfig): void;

  /**
   * Removes a config from the store.
   *
   * @param id The ID of the config to remove.
   */
  removeConfig(id: string): void;

  /**
   * Clears all configs from the store.
   */
  clearConfigs(): void;
}

/**
 * Does something useful.
 */
export function createConfigsStore<TConfig>({
  idField,
}: {
  idField: keyof TConfig;
}): ConfigStore<TConfig> {
  const useConfigStore = createStore<Store<TConfig>>((set) => ({
    configs: [],

    addConfig: (config) =>
      set((state) => ({
        // Add the config to `configs`
        configs: [...state.configs, config],
      })),

    removeConfig: (id) =>
      set((state) => ({
        configs: state.configs.filter(
          (config) => (config[idField] as unknown as string) !== id,
        ),
      })),

    clearConfigs: () =>
      set({
        // Clear configs
        configs: [],
      }),
  }));

  function get(id: string): TConfig;
  function get(ids: string[]): TConfig[];
  function get(id: string | string[]): TConfig | TConfig[] {
    const { configs } = useConfigStore.getState();
    if (Array.isArray(id)) {
      return configs.filter((config) =>
        id.includes(config[idField] as unknown as string),
      );
    }

    return configs.find(
      (config) => (config[idField] as unknown as string) === id,
    );
  }

  function add(config: TConfig): void;
  function add(configs: TConfig[]): void;
  function add(config: TConfig | TConfig[]): void {
    if (Array.isArray(config)) {
      config.forEach((c) => {
        useConfigStore.getState().addConfig(c);
      });
    } else {
      useConfigStore.getState().addConfig(config);
    }
  }

  return {
    get,
    add,
    getAll: () => useConfigStore.getState().configs,
    remove: (id) => useConfigStore.getState().removeConfig(id),
    clear: () => useConfigStore.getState().clearConfigs(),
    useConfig: (id) => useConfigStore(({ configs }) => configs[id] || null),
    useConfigs: (ids) =>
      useConfigStore(({ configs }) =>
        configs.filter((config) =>
          ids.includes(config[idField] as unknown as string),
        ),
      ),
    useAllConfigs: () => useConfigStore(({ configs }) => configs),
  };
}
