import React, { useState } from 'react';
import { NavGroup } from './NavGroup';
import { PageNavItem } from '../PageNavItem';

export default {
  title: 'ui/NavGroup',
  component: NavGroup,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('');

  return (
    <NavGroup title="Pages" style={{ maxWidth: 260 }}>
      <PageNavItem
        defaultExpanded
        label="Sailing"
        active={active === 'sailing'}
        onClick={() => setActive('sailing')}
      >
        <PageNavItem
          label="Sailboats"
          active={active === 'sailboats'}
          onClick={() => setActive('sailboats')}
        />
        <PageNavItem
          active={active === 'sails'}
          label="Sails"
          onClick={() => setActive('sails')}
        />
        <PageNavItem
          label="Navigation"
          active={active === 'navigation'}
          onClick={() => setActive('navigation')}
        >
          <PageNavItem
            label="Coastal navigation"
            active={active === 'coastal-navigation'}
            onClick={() => setActive('coastal-navigation')}
          />
          <PageNavItem
            label="Offshore navigation"
            active={active === 'offshore-navigation'}
            onClick={() => setActive('offshore-navigation')}
          />
        </PageNavItem>
        <PageNavItem
          label="Anchoring"
          active={active === 'anchoring'}
          onClick={() => setActive('anchoring')}
        />
      </PageNavItem>
    </NavGroup>
  );
};
