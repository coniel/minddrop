import React, { useState } from 'react';
import { DocumentNavItem } from '../DocumentNavItem';
import { NavGroup } from './NavGroup';

export default {
  title: 'ui/NavGroup',
  component: NavGroup,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('');

  return (
    <NavGroup title="Documents" style={{ maxWidth: 260 }}>
      <DocumentNavItem
        defaultExpanded
        label="Sailing"
        active={active === 'sailing'}
        onClick={() => setActive('sailing')}
      >
        <DocumentNavItem
          label="Sailboats"
          active={active === 'sailboats'}
          onClick={() => setActive('sailboats')}
        />
        <DocumentNavItem
          active={active === 'sails'}
          label="Sails"
          onClick={() => setActive('sails')}
        />
        <DocumentNavItem
          label="Navigation"
          active={active === 'navigation'}
          onClick={() => setActive('navigation')}
        >
          <DocumentNavItem
            label="Coastal navigation"
            active={active === 'coastal-navigation'}
            onClick={() => setActive('coastal-navigation')}
          />
          <DocumentNavItem
            label="Offshore navigation"
            active={active === 'offshore-navigation'}
            onClick={() => setActive('offshore-navigation')}
          />
        </DocumentNavItem>
        <DocumentNavItem
          label="Anchoring"
          active={active === 'anchoring'}
          onClick={() => setActive('anchoring')}
        />
      </DocumentNavItem>
    </NavGroup>
  );
};
