export type EventCallback = (name: string, payload: any) => void;

type EventPayload = Record<string, any>;

export type EventMap<T extends Record<string, EventPayload>> = {
  [K in keyof T]: T[K];
};
