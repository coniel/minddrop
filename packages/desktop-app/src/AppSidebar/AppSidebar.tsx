import { FC, useCallback } from 'react';
import {
  Sidebar,
  NavGroup,
  Toolbar,
  SecondaryNavItem,
  IconButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from '@minddrop/ui';
import {
  useThemeAppearance,
  useThemeAppearanceSetting,
  Theme,
  ThemeAppearanceSetting,
} from '@minddrop/theme';
import { useTranslation } from '@minddrop/i18n';
import { useCore } from '@minddrop/core';
import { AppUiState, useSidebarWidth } from '../AppUiState';
import './AppSidebar.css';

export const AppSidebar: FC = () => {
  const { t } = useTranslation();
  const themeAppearance = useThemeAppearance();
  const themeAppearanceSetting = useThemeAppearanceSetting();
  const core = useCore('minddrop:app');
  const initialWidth = useSidebarWidth();

  const handleResize = useCallback(
    (value: number) => AppUiState.set('sidebarWidth', value),
    [],
  );

  const handleChangeThemeAppearanceSetting = useCallback(
    (setting: string) => {
      Theme.setAppearanceSetting(core, setting as ThemeAppearanceSetting);
    },
    [core],
  );

  return (
    <Sidebar
      className="app-sidebar"
      data-testid="AppSidebar"
      initialWidth={initialWidth}
      onResized={handleResize}
    >
      <div className="app-drag-handle" />
      <NavGroup label="Main" />
      <NavGroup title={t('topics') as string}></NavGroup>
      <NavGroup label="Secondary">
        <SecondaryNavItem icon="trash" label={t('trash')} />
      </NavGroup>
      <div className="flex" />
      <Toolbar className="bottom-toolbar">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IconButton
              label="Theme appearance"
              icon={themeAppearance === 'dark' ? 'sun' : 'moon'}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="theme-appearance-setting-menu">
            <DropdownMenuLabel>{t('themeAppearance')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={themeAppearanceSetting}
              onValueChange={handleChangeThemeAppearanceSetting}
            >
              <DropdownMenuRadioItem
                value="system"
                label={t('themeAppearanceSystem')}
              />
              <DropdownMenuRadioItem
                value="light"
                label={t('themeAppearanceLight')}
              />
              <DropdownMenuRadioItem
                value="dark"
                label={t('themeAppearanceDark')}
              />
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Toolbar>
    </Sidebar>
  );
};
