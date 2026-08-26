import { useCallback } from 'react';
import { EventDataMap, Events } from '@minddrop/events';
import { BaseOpenViewEventData, ViewOpenEventName } from '../types';
import { useViewPane } from './useViewPane';

export type OpenView = <TEvent extends ViewOpenEventName>(
  event: TEvent,
  data: EventDataMap[TEvent],
) => void;

/**
 * Returns a function which dispatches a view opening event, tagging
 * it with the pane the calling component is rendered in so that the
 * view replaces that pane rather than the view area as a whole.
 *
 * Callers pass only the event's own data, and may override the pane
 * (e.g. to open elsewhere) by setting the fields themselves.
 */
export function useOpenView(): OpenView {
  const pane = useViewPane();

  // The callback is typed loosely because the merged data cannot be
  // related back to the generic event's data; the OpenView return
  // type restores the typed signature
  return useCallback(
    (event: string, data: BaseOpenViewEventData) => {
      // Dispatch the event, merging the pane under any values the
      // caller set
      Events.dispatch(event, {
        ...data,
        viewAreaId: data.viewAreaId ?? pane?.viewAreaId,
        sourcePane: data.sourcePane ?? pane?.pane,
      });
    },
    [pane],
  );
}
