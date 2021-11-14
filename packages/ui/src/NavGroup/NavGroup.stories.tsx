import React, { useState } from 'react';
import { NavGroup } from './NavGroup';
import { TopicNavItem } from '../TopicNavItem';

export default {
  title: 'ui/NavGroup',
  component: NavGroup,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('');

  return (
    <NavGroup title="Topics" style={{ maxWidth: 260 }}>
      <TopicNavItem
        defaultExpanded
        label="Sailing"
        active={active === 'sailing'}
        onClick={() => setActive('sailing')}
      >
        <TopicNavItem
          label="Sailboats"
          active={active === 'sailboats'}
          onClick={() => setActive('sailboats')}
        />
        <TopicNavItem
          active={active === 'sails'}
          label="Sails"
          onClick={() => setActive('sails')}
        />
        <TopicNavItem
          label="Navigation"
          active={active === 'navigation'}
          onClick={() => setActive('navigation')}
        >
          <TopicNavItem
            label="Coastal navigation"
            active={active === 'coastal-navigation'}
            onClick={() => setActive('coastal-navigation')}
          />
          <TopicNavItem
            label="Offshore navigation"
            active={active === 'offshore-navigation'}
            onClick={() => setActive('offshore-navigation')}
          />
        </TopicNavItem>
        <TopicNavItem
          label="Anchoring"
          active={active === 'anchoring'}
          onClick={() => setActive('anchoring')}
        />
      </TopicNavItem>
    </NavGroup>
  );
};
