import React from 'react';
import { Sidebar, NavGroup, TopicNavItem } from '@minddrop/ui';

export const SidebarDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        height: 220,
        flex: 1,
        width: 400,
        backgroundColor: 'var(--bgApp)',
        borderRadius: 6,
      }}
    >
      <Sidebar initialWidth={150} minWidth={100} maxWidth={300}>
        <NavGroup title="Topics">
          <TopicNavItem defaultExpanded label="Sailing">
            <TopicNavItem label="Sailboats" />
            <TopicNavItem label="Sails" />
            <TopicNavItem label="Navigation">
              <TopicNavItem label="Coastal navigation" />
              <TopicNavItem label="Offshore navigation" />
            </TopicNavItem>
            <TopicNavItem label="Anchoring" />
          </TopicNavItem>
        </NavGroup>
      </Sidebar>
    </div>
  </div>
);

export default SidebarDemo;
