import React from 'react';
import { ContentIcon, IconButton, IconButtonProps } from '@minddrop/ui-elements';
import { UserIcon, UserIconType, useIcon } from '@minddrop/icons';
import './NavItemIcon.css';
import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';

export interface NavItemIconProps
  extends Omit<IconButtonProps, 'icon' | 'label'> {
  /**
   * The stringified icon.
   */
  icon?: string;

  /**
   * The icon used as the default icon type in case
   * the stringified icon is not present or is invalid.
   */
  defaultIcon: UserIcon;
}

export const NavItemIcon = React.forwardRef<
  HTMLButtonElement,
  NavItemIconProps
>(({ icon: iconString, defaultIcon, ...other }, ref) => {
  const { icon } = useIcon(iconString || '', defaultIcon);
  const { t } = useTranslation();

  return (
    <IconButton
      size="small"
      ref={ref}
      label={t('iconPicker.change')}
      className={mapPropsToClasses(
        {
          'content-icon': icon.type === UserIconType.ContentIcon,
          emoji: icon.type === UserIconType.Emoji,
        },
        'nav-item-icon',
      )}
      {...other}
    >
      {icon.type === UserIconType.Emoji && (
        <span style={{ fontSize: '14px' }}>{icon.icon}</span>
      )}
      {icon.type === UserIconType.ContentIcon && (
        <ContentIcon name={icon.icon} color={icon.color} />
      )}
    </IconButton>
  );
});

NavItemIcon.displayName = 'NavItemIcon';
