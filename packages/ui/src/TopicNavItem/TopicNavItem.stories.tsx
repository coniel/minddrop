import React, { useState } from 'react';
import { TopicNavItem } from './TopicNavItem';

export default {
  title: 'ui/TopicNavItem',
  component: TopicNavItem,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('home');

  return (
    <div style={{ maxWidth: 260 }}>
      <TopicNavItem
        label="Home"
        active={active === 'home'}
        onClick={() => setActive('home')}
      />
      <TopicNavItem
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
    </div>
  );
};
