import { DragEffect } from './DragEffect.types';
import { DragOrigin } from './DragOrigin.types';

export interface ActiveDrag<TData = Record<string, unknown>> {
  /**
   * The ID of the dragged item.
   */
  id: string;

  /**
   * The type of the dragged item.
   */
  type: string;

  /**
   * The keys of the drag's data, matched against the types drop
   * targets accept.
   */
  types: string[];

  /**
   * The drag's data, keyed by data type.
   */
  data: TData;

  /**
   * Where the drag started from, or null when the source belongs to
   * no place.
   */
  origin: DragOrigin | null;

  /**
   * What a drop does with the item.
   */
  effect: DragEffect;

  /**
   * The bounds of the source element when the drag started.
   */
  sourceRect: DOMRect;

  /**
   * An identifier unique to this activation of the drag.
   */
  token: string;
}
