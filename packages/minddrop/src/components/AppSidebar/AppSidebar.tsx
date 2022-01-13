import React, { FC, useCallback } from 'react';
import { Sidebar, NavGroup } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { useTopics } from '@minddrop/topics';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import { Core } from '@minddrop/core';
import './AppSidebar.css';
import { TopicNavItem } from '../TopicNavItem';

export interface AppSidebarProps {
  core: Core;
}

export const AppSidebar: FC<AppSidebarProps> = ({ core }) => {
  const { t } = useTranslation();
  const topicIds = useGlobalPersistentStoreValue(core, 'topics');
  const width = useLocalPersistentStoreValue(core, 'sidebarWidth');
  const topics = useTopics(topicIds);

  const handleResize = useCallback(
    (value: number) =>
      PersistentStore.setLocalValue(core, 'sidebarWidth', value),
    [core],
  );

  return (
    <Sidebar
      className="app-sidebar"
      data-testid="AppSidebar"
      initialWidth={width}
      onResized={handleResize}
    >
      <NavGroup label="Main" />
      <NavGroup title={t('topics')}>
        {Object.values(topics).map((topic) => (
          <TopicNavItem key={topic.id} id={topic.id} />
        ))}
      </NavGroup>
      <NavGroup label="Secondary" />
    </Sidebar>
  );
};
