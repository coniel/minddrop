import { MenuContents, MenuItemConfig } from '@minddrop/ui-elements';

export interface DocumentOptionsMenu {
  /**
   * Callback fired when the add to favourites option
   * is selected.
   */
  onSelectFavouriteAdd?(event: Event): void;

  /**
   * Callback fired when the remove from favourites
   * option is selected.
   */
  onSelectFavouriteRemove?(event: Event): void;

  /**
   * Callback fired when the rename option is selected.
   */
  onSelectRename?(event: Event): void;

  /**
   * Callback fired when the change icon option is selected.
   */
  onSelectChangeIcon?(event: Event): void;

  /**
   * Callback fired when the move option is selected.
   */
  onSelectMove?(event: Event): void;

  /**
   * Callback fired when the delete option is selected.
   */
  onSelectDelete?(event: Event): void;

  /**
   * Callback fired when the reveal in file explorer
   * option is selected.
   */
  onSelectRevealInFileExplorer?(event: Event): void;
}

export const createDocumentOptionsMenu = (
  callbacks: DocumentOptionsMenu,
  isInFavourites?: boolean,
): MenuContents => {
  const favouriteOption: MenuItemConfig = isInFavourites
    ? {
        type: 'menu-item',
        label: 'documents.actions.favourite.remove',
        icon: 'minus',
        onSelect: callbacks.onSelectFavouriteRemove,
      }
    : {
        type: 'menu-item',
        label: 'documents.actions.favourite.add',
        icon: 'heart',
        onSelect: callbacks.onSelectFavouriteAdd,
      };

  return [
    {
      type: 'menu-item',
      label: 'documents.actions.rename.action',
      icon: 'edit',
      onSelect: callbacks.onSelectRename,
    },
    {
      type: 'menu-item',
      label: 'documents.actions.changeIcon',
      icon: 'star',
      onSelect: callbacks.onSelectChangeIcon,
    },
    { type: 'menu-separator' },
    {
      type: 'menu-item',
      label: 'documents.actions.move.action',
      icon: 'corner-up-right',
      onSelect: callbacks.onSelectMove,
    },
    {
      type: 'menu-item',
      label: 'documents.actions.delete.action',
      icon: 'trash',
      onSelect: callbacks.onSelectDelete,
    },
    { type: 'menu-separator' },
    favouriteOption,
    {
      type: 'menu-item',
      label: 'documents.actions.revealInFileExplorer.macos',
      icon: 'folder',
      onSelect: callbacks.onSelectRevealInFileExplorer,
    },
  ];
};
