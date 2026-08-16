import { Element, Frame } from '@minddrop/ast';
import { TranslationKey } from '@minddrop/i18n';
import { IconProp } from '@minddrop/ui-primitives';
import { EditorElementConfigs } from '../../EditorElementConfigs';
import { FrameMenuItems } from '../../FrameMenuItems';

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
   * The translation key of the terms the entry is found by in addition to
   * its label, as a space separated list.
   */
  keywords?: TranslationKey;

  /**
   * The icon displayed next to the label.
   */
  icon: IconProp;

  /**
   * Element data applied over the element type's initial data.
   */
  data?: Partial<Element>;

  /**
   * Builds the container the block is drawn inside, for entries which nest a
   * block rather than changing its type. Called once per use, since every
   * container is its own instance.
   */
  frame?: () => Frame;
}

/**
 * Collects the block menu entries of every block element type, along with
 * those which draw containers.
 *
 * @returns The block menu entries.
 */
export function getBlockMenuItems(): BlockMenuItem[] {
  const typeItems = EditorElementConfigs.flatMap((config) =>
    // Types without menu entries are omitted from the menu
    (config.menuItems || []).map((menuItem) => ({
      type: config.type,
      label: menuItem.label,
      keywords: menuItem.keywords,
      icon: menuItem.icon,
      data: menuItem.data,
    })),
  );

  return [...typeItems, ...FrameMenuItems];
}
