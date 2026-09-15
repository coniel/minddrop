import { ContentViewsStore } from '../ContentViewsStore';
import { ContentView } from '../types';

/**
 * Retrieves all content views of the given type, typed with the view
 * type's options and data.
 *
 * @param type - The view type to retrieve the content views of.
 * @returns The content views of the given type.
 */
export function getContentViewsOfType<
  TViewOptions extends object = object,
  TViewData extends object = object,
>(type: string): ContentView<TViewOptions, TViewData>[] {
  // Filter views down to those of the given type
  return ContentViewsStore.getAllArray().filter(
    (view) => view.type === type,
  ) as ContentView<TViewOptions, TViewData>[];
}
