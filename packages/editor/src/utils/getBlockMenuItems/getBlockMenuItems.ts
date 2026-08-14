import { Element } from '@minddrop/ast';
import { TranslationKey } from '@minddrop/i18n';
import { IconProp } from '@minddrop/ui-primitives';
import { EditorElementConfigs } from '../../EditorElementConfigs';

export interface BlockMenuItem {
  /**
   * The block element type inserted by the entry.
   */
  type: string;

  /**
   * The translation key of the label displayed in the menu.
   */
  label: TranslationKey;

  /**
   * The icon displayed next to the label.
   */
  icon: IconProp;

  /**
   * Element data applied over the element type's initial data.
   */
  data?: Partial<Element>;
}

/**
 * Collects the block menu entries of every block element type.
 *
 * @returns The block menu entries.
 */
export function getBlockMenuItems(): BlockMenuItem[] {
  return EditorElementConfigs.flatMap((config) =>
    // Types without menu entries are omitted from the menu
    (config.menuItems || []).map((menuItem) => ({
      type: config.type,
      label: menuItem.label,
      icon: menuItem.icon,
      data: menuItem.data,
    })),
  );
}
