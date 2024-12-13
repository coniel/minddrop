export interface Config<TValues extends object> {
  get<TKey extends keyof TValues>(key: TKey): TValues[TKey] | undefined;
  get<TKey extends keyof TValues>(
    key: TKey,
    defaultValue: TValues[TKey],
  ): TValues[TKey];
  get<TKey extends keyof TValues>(
    key: TKey,
    defaultValue?: TValues[TKey],
  ): TValues[TKey] | undefined;
  set<TKey extends keyof TValues>(key: TKey, value: TValues[TKey]): void;
  clear<TKey extends keyof TValues>(key: TKey): void;
  useValue<TKey extends keyof TValues>(
    key: TKey,
    defaultValue: TValues[TKey],
  ): TValues[TKey];
  useValue<TKey extends keyof TValues>(key: TKey): TValues[TKey] | undefined;
  useValue<TKey extends keyof TValues>(
    key: TKey,
    defaultValue?: TValues[TKey],
  ): TValues[TKey] | undefined;
}

export type ConfigValue = string | number | boolean | Date | null | undefined;

export type ConfigValues = Record<string, ConfigValue>;
