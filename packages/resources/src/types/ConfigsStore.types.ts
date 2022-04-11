export interface ConfigStore<TConfig> {
  /**
   * Retrieves a config by ID.
   *
   * @param id The ID of the config to get.
   */
  get(id: string): TConfig;

  /**
   * Returns an array of configs sorted according to their
   * order of addition (most recently added last).
   *
   * @param ids The IDs of the configs to get.
   */
  get(ids: string[]): TConfig[];

  /**
   * Returns an array of all configs sorted according
   * to their order of addition (most recently
   * registered last).
   */
  getAll(): TConfig[];

  /**
   * Sets the provided config to the store.
   *
   * @param config The config to set.
   */
  add(config: TConfig): void;

  /**
   * Adds the provided configs to the store.
   *
   * @param configs The configs to add.
   */
  add(configs: TConfig[]): void;

  /**
   * Removes a config from the store.
   *
   * @param id The ID of the config to remove.
   */
  remove(id: string): void;

  /**
   * Clears all configs from the store.
   */
  clear(): void;

  /**
   * A hook which returns a config by ID or `null`
   * if the config is not registered.
   *
   * @param id The ID of the config to retrieve.
   */
  useConfig(id: string): TConfig | null;

  /**
   * A hook that returns an array of configs sorted
   * according to their order of addition (most
   * recently registered last).
   *
   * @param ids The IDs of the configs to retrieve.
   */
  useConfigs(ids: string[]): TConfig[];

  /**
   * A hook that returns an array of all registered
   * configs sorted according to order of addition
   * (most recently registered last).
   */
  useAllConfigs(): TConfig[];
}
