import React from 'react';
import { PrimaryNavItem } from '@minddrop/ui';
import { Settings, Search, Drop } from '@minddrop/icons';

export const PrimaryNavItemDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        width: 260,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
        padding: '12px 6px',
        borderRadius: 'var(--radiusMd)',
        backgroundColor: 'var(--bgApp)',
      }}
    >
      <PrimaryNavItem label="Daily drops" icon={<Drop />} />
      <PrimaryNavItem label="Search" icon={<Search />} />
      <PrimaryNavItem label="Settings" icon={<Settings />} />
    </div>
  </div>
);

export default PrimaryNavItemDemo;
