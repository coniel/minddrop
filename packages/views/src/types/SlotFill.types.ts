export interface SlotFill {
  /**
   * Unique id of the fill within its kind, named by a session's slot
   * claim to render it.
   */
  id: string;

  /**
   * The component rendered in the slot. Fills are content only: the
   * slot's frame (e.g. the sidebar's width and resize handle) belongs
   * to the shell rendering the slot.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- must accept components with arbitrary props
  component: React.ComponentType<any>;
}

/**
 * The fill kinds, keyed by the slot they fill, each mapping to the
 * shape of its registered fills. Augmented by the packages declaring
 * further slots.
 */
export interface SlotFillMap {
  /**
   * The app sidebar, replaced by a view for as long as it is shown.
   */
  sidebar: SlotFill;
}

export type SlotFillKind = keyof SlotFillMap;
