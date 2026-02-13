import { uuid } from '@minddrop/utils';
import { getViewType } from '../../getViewType';
import { View } from '../../types';

/**
 * Generates a new view instance of the specified type.
 *
 * @param type The type of view to generate.
 * @returns A new view instance.
 */
export function generateView(type: string): View {
  // Get the view type
  const viewType = getViewType(type);

  // Generate the view
  const view: View = {
    type,
    id: uuid(),
    name: viewType.name,
  };

  // If the view type has a default options, merge them into the view
  if (viewType?.defaultOptions) {
    view.options = { ...viewType.defaultOptions, ...view.options };
  }

  return view;
}
