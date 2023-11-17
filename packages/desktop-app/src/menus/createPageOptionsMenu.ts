import { MenuContents, MenuItemConfig } from '@minddrop/ui';

export interface PageOptionsMenu {
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

export const createPageOptionsMenu = (
  callbacks: PageOptionsMenu,
  isInFavourites?: boolean,
): MenuContents => {
  const favouriteOption: MenuItemConfig = isInFavourites
    ? {
        type: 'menu-item',
        label: 'pages.actions.favourite.remove',
        icon: 'minus',
        onSelect: callbacks.onSelectFavouriteRemove,
      }
    : {
        type: 'menu-item',
        label: 'pages.actions.favourite.add',
        icon: 'heart',
        onSelect: callbacks.onSelectFavouriteAdd,
      };

  return [
    favouriteOption,
    {
      type: 'menu-item',
      label: 'pages.actions.revealInFileExplorer.macos',
      icon: 'diagonal-arrow-right-up',
      onSelect: callbacks.onSelectRevealInFileExplorer,
    },
    { type: 'menu-separator' },
    {
      type: 'menu-item',
      label: 'pages.actions.rename.action',
      icon: 'edit',
      onSelect: callbacks.onSelectRename,
    },
    {
      type: 'menu-item',
      label: 'pages.actions.changeIcon',
      icon: 'star',
      onSelect: callbacks.onSelectChangeIcon,
    },
    {
      type: 'menu-item',
      label: 'pages.actions.move.action',
      icon: 'corner-up-right',
      onSelect: callbacks.onSelectMove,
    },
    {
      type: 'menu-item',
      label: 'pages.actions.delete.action',
      icon: 'trash',
      onSelect: callbacks.onSelectDelete,
    },
  ];
};
