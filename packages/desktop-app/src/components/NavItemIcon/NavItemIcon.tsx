import React from 'react';
import { ContentIcon, Icon, IconButton, IconButtonProps } from '@minddrop/ui';
import { UserIcon, UserIconType } from '@minddrop/icons';
import './NavItemIcon.css';
import { useTranslation } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';

export interface NavItemIconProps
  extends Omit<IconButtonProps, 'icon' | 'label'> {
  /**
   * The icon to render.
   */
  icon: UserIcon;
}

export const NavItemIcon = React.forwardRef<
  HTMLButtonElement,
  NavItemIconProps
>(({ icon, ...other }, ref) => {
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
      {icon.type === UserIconType.Default && <Icon name="folder" />}
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
