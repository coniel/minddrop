/* eslint-disable no-console */
import React, { useState } from 'react';
import { Icon } from '../Icon';
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
        icon={<Icon name="extension" />}
        active={active === 'extensions'}
        onClick={() => setActive('extensions')}
      />
      <SecondaryNavItem
        label="Archive"
        icon={<Icon name="archive" />}
        active={active === 'archive'}
        onClick={() => setActive('archive')}
      />
      <SecondaryNavItem
        label="Trash"
        icon={<Icon name="trash" />}
        active={active === 'trash'}
        onClick={() => setActive('trash')}
      />
    </div>
  );
};
