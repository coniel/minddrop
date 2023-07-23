/* eslint-disable no-console */
import React, { useState } from 'react';
import { SecondaryNavItem } from './SecondaryNavItem';

export default {
  title: 'ui/SecondaryNavItem',
  component: SecondaryNavItem,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('extensions');

  return (
    <div
      style={{
        width: 260,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 2,
      }}
    >
      <SecondaryNavItem
        label="Extensions"
        icon="cube"
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
