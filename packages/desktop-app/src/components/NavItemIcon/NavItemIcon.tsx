import React from 'react';
import { ContentIcon, Icon, IconButton, IconButtonProps } from '@minddrop/ui';
import { UiIconName, UserIcon, UserIconType } from '@minddrop/icons';
import './NavItemIcon.css';
import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';

export interface NavItemIconProps
  extends Omit<IconButtonProps, 'icon' | 'label'> {
  /**
   * The icon to render.
   */
  icon: UserIcon;

  /**
   * The icon used as the default icon type.
   */
  defaultIcon: UiIconName;
}

export const NavItemIcon = React.forwardRef<
  HTMLButtonElement,
  NavItemIconProps
>(({ icon, defaultIcon, ...other }, ref) => {
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
      {icon.type === UserIconType.Default && <Icon name={defaultIcon} />}
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
