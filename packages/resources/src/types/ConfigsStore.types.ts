export interface ConfigStore<TConfig> {
  /**
   * Retrieves a config by ID. The config 'ID' field is determined
   * by the `idField` option provided when the store was created.
   *
   * @param id The ID of the config to get.
   */
  get(id: string): TConfig;

  /**
   * Returns an array of configs sorted according to their
   * order of addition (most recently added last). The config 'ID'
   * field is determined by the `idField` option provided when the
   * store was created.
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
   * Adds the provided config(s) to the store.
   *
   * @param config The config to register.
   */
  register(config: TConfig | TConfig[]): void;

  /**
   * Removes the provided config(s) from the store.
   *
   * @param config The config(s) to unregister.
   */
  unregister(config: TConfig | TConfig[]): void;

  /**
   * Clears all configs from the store.
   */
  clear(): void;

  /**
   * A hook which returns a config by ID or `null`
   * if the config is not registered. The config 'ID'
   * field is determined by the `idField` option
   * provided when the store was created.
   *
   * @param id The ID of the config to retrieve.
   */
  useConfig(id: string): TConfig | null;

  /**
   * A hook that returns an array of configs sorted
   * according to their order of addition (most
   * recently registered last). The config 'ID' field
   * is determined by the `idField` option provided
   * when the store was created.
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
