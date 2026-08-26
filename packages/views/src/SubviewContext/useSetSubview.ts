import { useCallback } from 'react';
import { useOpenView } from '../ViewPaneContext';
import { SetSubviewEvent } from '../events';
import { SubviewDescriptor } from '../types';

export type SetSubview = (
  subview: SubviewDescriptor | null,
  options?: { replace?: boolean },
) => void;

/**
 * Returns a function which announces the entity a view now shows
 * within itself, tagged with the pane the calling component is
 * rendered in.
 *
 * The change is a navigation, so it can be navigated back and forward
 * through, unless replacing (e.g. when selecting a default).
 */
export function useSetSubview(): SetSubview {
  const openView = useOpenView();

  return useCallback<SetSubview>(
    (subview, options) => {
      openView(SetSubviewEvent, {
        subview,
        replace: options?.replace,
      });
    },
    [openView],
  );
}
