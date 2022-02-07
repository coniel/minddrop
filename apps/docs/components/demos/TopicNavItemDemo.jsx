import React, { useState } from 'react';
import { TopicNavItem } from '@minddrop/ui';

export const TopicNavItemDemo = () => {
  const [active, setActive] = useState('');
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{
          width: 260,
          padding: 16,
          backgroundColor: 'var(--bgApp)',
          borderRadius: 'var(--radiusLg)',
        }}
      >
        <TopicNavItem
          label="Sailing"
          defaultExpanded
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
    </div>
  );
};

export default TopicNavItemDemo;
