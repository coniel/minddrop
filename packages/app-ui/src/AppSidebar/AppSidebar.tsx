import React, { FC, useCallback } from 'react';
import { Sidebar, NavGroup, Toolbar } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import {
  LocalPersistentStore,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { useAppCore, useRootTopics } from '@minddrop/app';
import { TopicNavItem } from '../TopicNavItem';
import { AddTopicButton } from '../AddTopicButton';
import './AppSidebar.css';

export const AppSidebar: FC = () => {
  const { t } = useTranslation();
  const core = useAppCore();
  const width = useLocalPersistentStoreValue(core, 'sidebarWidth', 300);
  const topics = useRootTopics();

  const handleResize = useCallback(
    (value: number) => LocalPersistentStore.set(core, 'sidebarWidth', value),
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
      <NavGroup label="Secondary" />
      <div className="flex" />
      <Toolbar className="bottom-toolbar" />
    </Sidebar>
  );
};
