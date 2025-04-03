import { Collection, Collections } from '@minddrop/collections';
import {
  CollectionNavItem as BaseCollectionNavItem,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverPortal,
} from '@minddrop/ui-elements';
import { useCreateCallback, useToggle } from '@minddrop/utils';
import { AppUiState } from '../../AppUiState';
import { promptMoveCollection, revealInFileExplorer } from '../../api';
import { CollectionNavItemIcon } from '../CollectionNavItemIcon';
import { CollectionOptionsMenu } from '../CollectionOptionsMenu';
import { RenameCollectionPopover } from '../RenameCollectionPopover';

interface CollectionNavItemProps {
  /**
   * The collection.
   */
  collection: Collection;
}

export const CollectionNavItem: React.FC<CollectionNavItemProps> = ({
  collection,
}) => {
  const [hovering, toggleHovering] = useToggle(false);
  const [renamePopoverOpen, toggleRenamePopover] = useToggle(false);
  const [iconPopoverOpen, toggle, setIconPopoverOpen] = useToggle(false);
  const handleMove = useCreateCallback(promptMoveCollection, collection.path);
  const handleRemove = useCreateCallback(Collections.remove, collection.path);
  const handleDelete = useCreateCallback(Collections.delete, collection.path);
  const handleRevealInFileExplorer = useCreateCallback(
    revealInFileExplorer,
    collection.path,
  );

  function handleClick() {
    AppUiState.set('view', 'collection');
    AppUiState.set('activeDocumentId', collection.path);
  }

  return (
    <div style={{ position: 'relative' }}>
      <Popover open={renamePopoverOpen} onOpenChange={() => {}}>
        <PopoverAnchor>
          <BaseCollectionNavItem
            hovering={hovering}
            key={collection.name}
            label={collection.name}
            onClick={handleClick}
            icon={
              <CollectionNavItemIcon
                collection={collection}
                showIconSelection={iconPopoverOpen}
                onShowIconSelectionChange={setIconPopoverOpen}
              />
            }
            actions={
              <div style={{ columnGap: 2, display: 'flex' }}>
                <CollectionOptionsMenu
                  path={collection.path}
                  onOpenChange={toggleHovering}
                  onSelectRename={toggleRenamePopover}
                  onSelectChangeIcon={toggle}
                  onSelectMove={handleMove}
                  onSelectRemove={handleRemove}
                  onSelectDelete={handleDelete}
                  onSelectRevealInFileExplorer={handleRevealInFileExplorer}
                >
                  <IconButton
                    label="Collection options"
                    size="small"
                    icon="more-vertical"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                  />
                </CollectionOptionsMenu>
                <IconButton
                  label={`+ ${collection.itemName}`}
                  size="small"
                  icon="plus"
                />
              </div>
            }
          ></BaseCollectionNavItem>
        </PopoverAnchor>
        <PopoverPortal>
          <RenameCollectionPopover
            collection={collection}
            onClose={toggleRenamePopover}
          />
        </PopoverPortal>
      </Popover>
    </div>
  );
};
