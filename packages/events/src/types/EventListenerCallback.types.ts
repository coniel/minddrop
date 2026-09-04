export type EventListenerCallback<TData = unknown> = (
  data: TData,
  eventName: string,
) => void | Promise<void>;
