import React, { FC, useCallback } from 'react';
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
import {
  LocalPersistentStore,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { useAppCore, useRootTopics, useCurrentView, App } from '@minddrop/app';
import { TopicNavItem } from '../TopicNavItem';
import { AddTopicButton } from '../AddTopicButton';
import './AppSidebar.css';

export const AppSidebar: FC = () => {
  const { t } = useTranslation();
  const core = useAppCore();
  const width = useLocalPersistentStoreValue(core, 'sidebarWidth', 300);
  const topics = useRootTopics();
  const { view } = useCurrentView();
  const themeAppearance = useThemeAppearance();
  const themeAppearanceSetting = useThemeAppearanceSetting();

  const handleResize = useCallback(
    (value: number) => LocalPersistentStore.set(core, 'sidebarWidth', value),
    [core],
  );

  const openTrashView = useCallback(() => {
    App.openView(core, 'app:trash');
  }, [core]);

  const handleChangeThemeAppearanceSetting = useCallback(
    (setting: ThemeAppearanceSetting) => {
      Theme.setAppearanceSetting(core, setting);
    },
    [core],
  );

  return (
    <Sidebar
      className="app-sidebar"
      data-testid="AppSidebar"
      initialWidth={width}
      onResized={handleResize}
    >
      <div className="app-drag-handle" />
      <NavGroup label="Main" />
      <NavGroup title={t('topics')}>
        {Object.values(topics).map((topic) => (
          <TopicNavItem key={topic.id} trail={[topic.id]} />
        ))}
        <AddTopicButton />
      </NavGroup>
      <NavGroup label="Secondary">
        <SecondaryNavItem
          icon="trash"
          label={t('trash')}
          onClick={openTrashView}
          active={view.id === 'app:trash'}
        />
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
