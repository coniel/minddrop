import { ContentViewType } from '@minddrop/content-views';
import { Icons } from '@minddrop/ui-icons';
import { MenuContents, MenuItemConfig } from '@minddrop/ui-primitives';

/**
 * Resolves content view types into the menu actions which create a
 * view of the type.
 *
 * @param viewTypes - The content view types to list.
 * @param onSelectViewType - Callback fired with the selected view type.
 * @returns The menu actions.
 */
export function resolveContentViewTypeActions(
  viewTypes: ContentViewType[],
  onSelectViewType: (viewType: string) => void,
): MenuContents {
  return viewTypes.map(
    (viewType): MenuItemConfig => ({
      type: 'menu-item',
      contentIcon: Icons.fromName(viewType.icon),
      label: viewType.name,
      tooltip: { title: viewType.description },
      onSelect: () => onSelectViewType(viewType.type),
    }),
  );
}
