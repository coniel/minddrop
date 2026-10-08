import { FC } from 'react';
import { ContentViewTypes, ViewDataSourceType } from '@minddrop/content-views';
import { Icons } from '@minddrop/ui-icons';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  IconButtonProps,
  MenuGroup,
} from '@minddrop/ui-primitives';

export interface AddContentViewMenuProps
  extends Omit<IconButtonProps, 'icon' | 'label' | 'stringLabel'> {
  /**
   * The data source types to filter view types by. Only view
   * types which support at least one of the data sources are
   * listed. When omitted, all view types are listed.
   */
  dataSources?: ViewDataSourceType[];

  /**
   * Called with the selected view type when a menu item is
   * selected.
   */
  onSelectViewType: (type: string) => void;
}

/**
 * Renders an icon button that opens a dropdown menu listing the
 * registered content view types which support the given data source,
 * allowing the user to select one to add.
 */
export const AddContentViewMenu: FC<AddContentViewMenuProps> = ({
  dataSources,
  onSelectViewType,
  ...rest
}) => {
  // Read the view types supporting one of the data sources, or every
  // view type when no data sources are given.
  const supportedViewTypes = ContentViewTypes.useForDataSources(dataSources);

  return (
    <DropdownMenu
      trigger={
        <IconButton label="contentViews.actions.add" icon="plus" {...rest} />
      }
      minWidth={200}
    >
      <MenuGroup>
        {supportedViewTypes.map((viewType) => (
          <DropdownMenuItem
            key={viewType.type}
            contentIcon={Icons.fromName(viewType.icon)}
            label={viewType.name}
            tooltip={{ title: viewType.description }}
            onSelect={() => onSelectViewType(viewType.type)}
          />
        ))}
      </MenuGroup>
    </DropdownMenu>
  );
};
