import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopicNavItem } from '../TopicNavItem';

export default {
  title: 'ui/Sidebar',
  component: Sidebar,
};

export const Default: React.FC = () => {
  const [width, setWidth] = useState(300);
  const [active, setActive] = useState('');

  return (
    <div
      style={{ width: '100%', height: '100%', marginTop: -16, marginLeft: -16 }}
    >
      <Sidebar
        initialWidth={width}
        onResized={setWidth}
        style={{ padding: '24px 8px' }}
      >
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
      </Sidebar>
    </div>
  );
};
