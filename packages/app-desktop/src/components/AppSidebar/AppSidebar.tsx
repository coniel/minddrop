import React from 'react';
import { useStore } from '@minddrop/core';
import {
  Sidebar,
  NavGroup,
  TopicNavItem,
  SecondaryNavItem,
} from '@minddrop/ui';
import './AppSidebar.css';

export const AppSidebar: React.FC = () => {
  const topics = useStore((state) => state.topics);

  return (
    <Sidebar>
      <div className="app-drag-handle" />
      <NavGroup label="Main" />
      <NavGroup title="Topics">
        {topics.map((topic) => (
          <TopicNavItem key={topic.id} label={topic.title} />
        ))}
        <SecondaryNavItem label="Add topic" icon="add" />
      </NavGroup>
      <NavGroup label="Tools" />
    </Sidebar>
  );
};
