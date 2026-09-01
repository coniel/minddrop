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

  // The callback takes the base data rather than the event's own,
  // as the merged data cannot be related back to the generic
  // event's data; the OpenView return type restores the typed
  // signature
  return useCallback(
    (event: ViewOpenEventName, data: BaseOpenViewEventData) => {
      // Merge the pane under any values the caller set
      const eventData = {
        ...data,
        viewAreaId: data.viewAreaId ?? pane?.viewAreaId,
        sourcePane: data.sourcePane ?? pane?.pane,
      };

      // Dispatch the event, casting the merged data back to the
      // event's own
      Events.dispatch(event, eventData as EventDataMap[ViewOpenEventName]);
    },
    [pane],
  );
}
