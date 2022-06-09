import createStore from 'zustand';
import { ConfigsStore, ConfigsStoreOptions } from '../types';

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
  removeConfig(config: TConfig): void;

  /**
   * Clears all configs from the store.
   */
  clearConfigs(): void;
}

/**
 * Creates a store for storing configuration objects.
 *
 * @params options - The store options.
 * @returns A configs store.
 */
export function createConfigsStore<TConfig>(
  options: ConfigsStoreOptions,
): ConfigsStore<TConfig> {
  const { idField } = options;

  const useConfigsStore = createStore<Store<TConfig>>((set) => ({
    configs: [],

    addConfig: (config) =>
      set((state) => ({
        // Add the config to `configs`
        configs: [...state.configs, config],
      })),

    removeConfig: (config) =>
      set((state) => ({
        configs: state.configs.filter((c) => c[idField] !== config[idField]),
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
    const { configs } = useConfigsStore.getState();
    if (Array.isArray(id)) {
      return configs.filter((config) =>
        id.includes(config[idField] as unknown as string),
      );
    }

    return configs.find(
      (config) => (config[idField] as unknown as string) === id,
    );
  }

  function register(config: TConfig): void;
  function register(configs: TConfig[]): void;
  function register(config: TConfig | TConfig[]): void {
    if (Array.isArray(config)) {
      config.forEach((c) => {
        useConfigsStore.getState().addConfig(c);
      });
    } else {
      useConfigsStore.getState().addConfig(config);
    }
  }

  function unregister(config: TConfig): void;
  function unregister(configs: TConfig[]): void;
  function unregister(config: TConfig | TConfig[]): void {
    if (Array.isArray(config)) {
      config.forEach((c) => {
        useConfigsStore.getState().removeConfig(c);
      });
    } else {
      useConfigsStore.getState().removeConfig(config);
    }
  }

  return {
    get,
    getAll: <T extends TConfig = TConfig>() =>
      useConfigsStore.getState().configs as T[],
    register,
    unregister,
    clear: () => useConfigsStore.getState().clearConfigs(),
    useConfig: (id) => useConfigsStore(({ configs }) => configs[id] || null),
    useConfigs: <T extends TConfig = TConfig>(ids: string[]) =>
      useConfigsStore(
        ({ configs }) =>
          configs.filter((config) =>
            ids.includes(config[idField] as unknown as string),
          ) as T[],
      ),
    useAllConfigs: <T extends TConfig = TConfig>() =>
      useConfigsStore(({ configs }) => configs) as T[],
  };
}
