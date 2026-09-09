import {
  DesignElementConfigs,
  DesignElementGroup,
  Designs,
} from '@minddrop/designs-next';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import {
  MenuGroup,
  MenuLabel,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  SearchableMenu,
  SearchableMenuItem,
} from '@minddrop/ui-primitives';
import './DesignElementInsertMenu.css';

export interface DesignElementInsertMenuProps {
  /**
   * The element the menu positions itself against.
   */
  anchor: PopoverPositionerProps['anchor'];

  /**
   * Whether the menu is open.
   */
  open: boolean;

  /**
   * Callback fired when the menu is opened or closed.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Callback fired with the type of the selected element.
   */
  onSelect: (type: string) => void;
}

const groupKey = createI18nKeyBuilder('designsNext.elements.groups.');

/**
 * Renders a searchable menu of the insertable element types, grouped
 * by element group, floating against the given anchor. Searching
 * flattens the groups into a ranked list of matches.
 *
 * Built on a popover rather than a dropdown menu because it opens
 * from a position rather than from a trigger, which a menu treats as
 * a hover-opened menu and closes again as the pointer leaves it.
 */
export const DesignElementInsertMenu: React.FC<
  DesignElementInsertMenuProps
> = ({ anchor, open, onOpenChange, onSelect }) => {
  const { t } = useTranslation();
  const configs = DesignElementConfigs.useAll();

  // Renders a group's items, omitting empty groups
  function renderGroup(group: DesignElementGroup) {
    const members = configs.filter((config) => config.group === group);

    if (members.length === 0) {
      return null;
    }

    return (
      <MenuGroup key={group}>
        <MenuLabel label={groupKey(group)} />
        {members.map((config) => (
          <SearchableMenuItem
            key={config.type}
            label={config.label}
            icon={config.icon}
            onSelect={() => onSelect(config.type)}
          />
        ))}
      </MenuGroup>
    );
  }

  // Modal so the press which dismisses the menu stops at it rather
  // than landing on the square below and opening the menu again
  // there.
  return (
    <Popover modal open={open} onOpenChange={onOpenChange}>
      <PopoverPortal>
        <PopoverPositioner anchor={anchor} side="bottom" align="start">
          <PopoverContent
            className="designs-next-element-insert-menu"
            render={
              <SearchableMenu
                searchPlaceholder="designsNext.editor.insertElement"
                emptyText={t('designsNext.editor.noMatchingElements')}
              >
                {Designs.constants.ElementGroups.map(renderGroup)}
              </SearchableMenu>
            }
          />
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
