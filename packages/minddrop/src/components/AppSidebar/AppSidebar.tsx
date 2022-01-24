import React, { FC, useCallback } from 'react';
import { Sidebar, NavGroup, Toolbar } from '@minddrop/ui';
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
import { AddTopicButton } from '../AddTopicButton';

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

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
  }

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
          <TopicNavItem key={topic.id} id={topic.id} />
        ))}
        <AddTopicButton core={core} />
      </NavGroup>
      <NavGroup label="Secondary" />
      <div className="flex" />
      <Toolbar className="bottom-toolbar" />
    </Sidebar>
  );
};
