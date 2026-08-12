import { useCallback } from 'react';
import { Events } from '@minddrop/events';
import { BaseOpenViewEventData } from '../types';
import { useViewPane } from './useViewPane';

export type OpenView = <TData>(
  event: string,
  data: TData & BaseOpenViewEventData,
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

  return useCallback<OpenView>(
    (event, data) => {
      Events.dispatch<BaseOpenViewEventData>(event, {
        ...data,
        viewAreaId: data.viewAreaId ?? pane?.viewAreaId,
        sourcePane: data.sourcePane ?? pane?.pane,
      });
    },
    [pane],
  );
}
