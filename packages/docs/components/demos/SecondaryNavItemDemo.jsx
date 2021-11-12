import React, { useState } from 'react';
import { SecondaryNavItem } from '@minddrop/ui';
import { Extension, Archive, Trash } from '@minddrop/icons';

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
        icon={<Extension />}
        active={active === 'extensions'}
        onClick={() => setActive('extensions')}
      />
      <SecondaryNavItem
        label="Archive"
        icon={<Archive />}
        active={active === 'archive'}
        onClick={() => setActive('archive')}
      />
      <SecondaryNavItem
        label="Trash"
        icon={<Trash />}
        active={active === 'trash'}
        onClick={() => setActive('trash')}
      />
    </div>
  );
};

export default SecondaryNavItemDemo;
