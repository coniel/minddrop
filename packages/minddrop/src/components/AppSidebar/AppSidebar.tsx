import React, { FC, useCallback } from 'react';
import { Sidebar, NavGroup, Toolbar } from '@minddrop/ui';
import { useTranslation } from '@minddrop/i18n';
import { useTopics } from '@minddrop/topics';
import {
  PersistentStore,
  useGlobalPersistentStoreValue,
  useLocalPersistentStoreValue,
} from '@minddrop/persistent-store';
import './AppSidebar.css';
import { TopicNavItem } from '../TopicNavItem';
import { AddTopicButton } from '../AddTopicButton';
import { useAppCore } from '../../utils';

export const AppSidebar: FC = () => {
  const { t } = useTranslation();
  const core = useAppCore();
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
