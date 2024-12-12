export interface Config {
  get<TValue>(key: string): TValue | undefined;
  get<TValue>(key: string, defaultValue: TValue): TValue;
  get<TValue>(key: string, defaultValue?: TValue): TValue | undefined;
  set(key: string, value: unknown): void;
  clear(key: string): void;
  useValue<TValue>(key: string, defaultValue: TValue): TValue;
  useValue<TValue>(key: string): TValue | undefined;
  useValue<TValue>(key: string, defaultValue?: TValue): TValue | undefined;
}
