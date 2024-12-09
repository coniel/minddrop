import { Blocks } from '@minddrop/blocks';
import {
  ContentColor,
  ContentColors,
  MenuContents,
} from '@minddrop/ui-elements';
import { i18n } from '@minddrop/i18n';

interface BlockOptionsMenuCallbacks {
  /**
   * Callback fired when move option is selected.
   */
  onSelectMove(event: Event): void;
}

export const createBlockOptionsMenu = (
  blockId: string,
  callbacks: BlockOptionsMenuCallbacks,
): MenuContents => {
  const { onSelectMove } = callbacks;

  function changeBlockColor(color: ContentColor) {
    Blocks.update(blockId, { color });
  }

  function copyBlock() {
    const block = Blocks.get(blockId);

    if (block) {
      // Copy the block to the clipboard
      Blocks.copyToClipboard([block]);
    }
  }

  function deleteBlock() {
    Blocks.delete(blockId);
  }

  return [
    {
      type: 'menu-item',
      label: i18n.t('blocks.actions.color.action'),
      icon: 'color-palette',
      submenuContentClass: 'color-selection-submenu',
      submenu: ContentColors.map((color) => ({
        type: 'menu-color-selection-item',
        color: color.value,
        onSelect: () => changeBlockColor(color.value),
      })),
    },
    { type: 'menu-separator' },
    {
      type: 'menu-item',
      label: 'blocks.actions.copy.action',
      icon: 'copy',
      onSelect: copyBlock,
    },
    {
      type: 'menu-item',
      label: 'blocks.actions.move.action',
      icon: 'diagonal-arrow-right-up',
      onSelect: onSelectMove,
    },
    {
      type: 'menu-item',
      label: 'blocks.actions.delete.action',
      icon: 'trash',
      onSelect: deleteBlock,
    },
  ];
};
