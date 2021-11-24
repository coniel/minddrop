import React from 'react';
import { Sidebar, NavGroup, Toolbar } from '@minddrop/ui';
import './AppSidebar.css';

export const AppSidebar: React.FC = () => {
  return (
    <Sidebar>
      <div className="app-drag-handle" />
      <NavGroup label="Main" />
      <NavGroup title="Topics" />
      <NavGroup label="Tools" />
      <div className="flex" />
      <Toolbar className="bottom-toolbar" />
    </Sidebar>
  );
};
