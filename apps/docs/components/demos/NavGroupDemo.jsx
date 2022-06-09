import React from 'react';
import { NavGroup, TopicNavItem } from '@minddrop/ui';

export const NavGroupDemo = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px 32px 16px',
      backgroundColor: 'var(--bgApp)',
      borderRadius: 'var(--radiusLg)',
      width: 300,
    }}
  >
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
  </div>
);

export default NavGroupDemo;
