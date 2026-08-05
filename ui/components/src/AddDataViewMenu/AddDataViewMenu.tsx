import { FC, useMemo } from 'react';
import { DataViewTypes, ViewDataSourceType } from '@minddrop/data-views';
import { UiIconName } from '@minddrop/ui-icons';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  IconButtonProps,
  MenuGroup,
} from '@minddrop/ui-primitives';

export interface AddDataViewMenuProps
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
 * registered data view types which support the given data source,
 * allowing the user to select one to add.
 */
export const AddDataViewMenu: FC<AddDataViewMenuProps> = ({
  dataSources,
  onSelectViewType,
  ...rest
}) => {
  const viewTypes = DataViewTypes.useAll();

  // Filter to view types supporting at least one of the data
  // sources, or all view types when no data sources are given
  const supportedViewTypes = useMemo(() => {
    // No filter, all view types are valid
    if (!dataSources) {
      return viewTypes;
    }

    return viewTypes.filter((viewType) =>
      dataSources.some((dataSource) =>
        viewType.supportedDataSources.includes(dataSource),
      ),
    );
  }, [viewTypes, dataSources]);

  return (
    <DropdownMenu
      trigger={
        <IconButton label="dataViews.actions.add" icon="plus" {...rest} />
      }
      minWidth={200}
    >
      <MenuGroup>
        {supportedViewTypes.map((viewType) => (
          <DropdownMenuItem
            key={viewType.type}
            icon={viewType.icon as UiIconName}
            label={viewType.name}
            tooltip={{ title: viewType.description }}
            onSelect={() => onSelectViewType(viewType.type)}
          />
        ))}
      </MenuGroup>
    </DropdownMenu>
  );
};
