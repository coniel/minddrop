import React, { useState } from 'react';
import { SecondaryNavItem } from '@minddrop/ui';

export const SecondaryNavItemDemo = () => {
  const [active, setActive] = useState('extensions');

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
      <SecondaryNavItem
        label="Extensions"
        icon="extension"
        active={active === 'extensions'}
        onClick={() => setActive('extensions')}
      />
      <SecondaryNavItem
        label="Archive"
        icon="archive"
        active={active === 'archive'}
        onClick={() => setActive('archive')}
      />
      <SecondaryNavItem
        label="Trash"
        icon="trash"
        active={active === 'trash'}
        onClick={() => setActive('trash')}
      />
    </div>
  );
};

export default SecondaryNavItemDemo;
