import { FC } from 'react';
import { DesignType, Designs } from '@minddrop/designs-next';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import {
  DropdownMenu,
  DropdownMenuItem,
  IconButton,
  IconButtonProps,
  MenuGroup,
} from '@minddrop/ui-primitives';

export interface AddDesignMenuProps
  extends Omit<IconButtonProps, 'icon' | 'label' | 'stringLabel'> {
  /**
   * Called with the selected design type when a menu item is
   * selected.
   */
  onSelectType: (type: DesignType) => void;
}

// The design types a database can own. Spaces own their own design.
const DesignTypes: DesignType[] = ['card', 'list', 'page'];

const typeKey = createI18nKeyBuilder('designsNext.types.');

/**
 * Renders an icon button that opens a dropdown menu listing the
 * design types a database can create.
 */
export const AddDesignMenu: FC<AddDesignMenuProps> = ({
  onSelectType,
  ...rest
}) => (
  <DropdownMenu
    trigger={
      <IconButton
        label="databases.design.actions.add"
        tooltip={{ title: 'databases.design.actions.add' }}
        icon="plus"
        {...rest}
      />
    }
    minWidth={200}
  >
    <MenuGroup>
      {DesignTypes.map((type) => (
        <DropdownMenuItem
          key={type}
          icon={Designs.constants.TypeIcons[type]}
          label={typeKey(type)}
          onSelect={() => onSelectType(type)}
        />
      ))}
    </MenuGroup>
  </DropdownMenu>
);
