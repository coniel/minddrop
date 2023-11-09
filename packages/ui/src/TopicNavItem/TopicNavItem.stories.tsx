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
          level={1}
          label="Sailboats"
          active={active === 'sailboats'}
          onClick={() => setActive('sailboats')}
        />
        <TopicNavItem
          level={1}
          active={active === 'sails'}
          label="Sails"
          onClick={() => setActive('sails')}
        />
        <TopicNavItem
          level={1}
          label="Navigation"
          active={active === 'navigation'}
          onClick={() => setActive('navigation')}
        >
          <TopicNavItem
            level={2}
            label="Coastal navigation"
            active={active === 'coastal-navigation'}
            onClick={() => setActive('coastal-navigation')}
          />
          <TopicNavItem
            level={2}
            label="Offshore navigation"
            active={active === 'offshore-navigation'}
            onClick={() => setActive('offshore-navigation')}
          />
        </TopicNavItem>
        <TopicNavItem
          level={1}
          label="Anchoring"
          active={active === 'anchoring'}
          onClick={() => setActive('anchoring')}
        />
      </TopicNavItem>
    </div>
  );
};
