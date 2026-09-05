export interface EventLogEntry<TData = unknown> {
  /**
   * Identifies the entry within the log.
   */
  id: number;

  /**
   * The dispatched event's name.
   */
  name: string;

  /**
   * The dispatched event's data.
   */
  data: TData;

  /**
   * When the event was dispatched.
   */
  timestamp: Date;
}
