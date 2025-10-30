import { Events } from '@minddrop/events';
import { ItemTypes } from '@minddrop/item-types';
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  MenuItem,
  MenuLabel,
} from '@minddrop/ui-primitives';
import { Sidebar, SidebarProps } from '../Sidebar';

export const AppSidebar: React.FC<SidebarProps> = ({ ...other }) => {
  const itemTypes = ItemTypes.useAll();

  function handleAddItemType(event: React.MouseEvent) {
    event.stopPropagation();
    Events.dispatch('item-types:new-item-type-dialog:open');
  }

  function handleOpenItemTypesView(type: string) {
    Events.dispatch('item-type:view:open', { type });
  }

  return (
    <Sidebar {...other}>
      <div>
        <Collapsible defaultOpen>
          <CollapsibleTrigger
            nativeButton={false}
            render={
              <MenuLabel
                button
                label="items.labels.items"
                actions={
                  <Button
                    size="small"
                    label="itemTypes.actions.add"
                    variant="text"
                    startIcon="plus"
                    onClick={handleAddItemType}
                  />
                }
              />
            }
          />
          <CollapsibleContent>
            {itemTypes.map((itemType) => (
              <MenuItem
                muted
                contentIcon={itemType.icon || 'content-icon:shapes:inherit'}
                key={itemType.nameSingular}
                onClick={() => handleOpenItemTypesView(itemType.nameSingular)}
              >
                {itemType.namePlural}
              </MenuItem>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Sidebar>
  );
};
