import React, { useState } from 'react';
import { Icon } from '../Icon';
import { PrimaryNavItem } from './PrimaryNavItem';

export default {
  title: 'ui/PrimaryNavItem',
  component: PrimaryNavItem,
};

export const Default = () => {
  const [active, setActive] = useState('daily-drops');

  return (
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
      <PrimaryNavItem
        label="Daily drops"
        icon={<Icon name="drop" />}
        active={active === 'daily-drops'}
        onClick={() => setActive('daily-drops')}
      />
      <PrimaryNavItem
        label="Search"
        icon={<Icon name="search" />}
        active={active === 'search'}
        onClick={() => setActive('search')}
      />
      <PrimaryNavItem
        label="Settings"
        icon={<Icon name="settings" />}
        active={active === 'settings'}
        onClick={() => setActive('settings')}
      />
    </div>
  );
};
