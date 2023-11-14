import React, { useState } from 'react';
import { PageNavItem } from './PageNavItem';

export default {
  title: 'ui/PageNavItem',
  component: PageNavItem,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('home');

  return (
    <div style={{ maxWidth: 260 }}>
      <PageNavItem
        label="Home"
        active={active === 'home'}
        onClick={() => setActive('home')}
      />
      <PageNavItem
        label="Sailing"
        active={active === 'sailing'}
        onClick={() => setActive('sailing')}
      >
        <PageNavItem
          level={1}
          label="Sailboats"
          active={active === 'sailboats'}
          onClick={() => setActive('sailboats')}
        />
        <PageNavItem
          level={1}
          active={active === 'sails'}
          label="Sails"
          onClick={() => setActive('sails')}
        />
        <PageNavItem
          level={1}
          label="Navigation"
          active={active === 'navigation'}
          onClick={() => setActive('navigation')}
        >
          <PageNavItem
            level={2}
            label="Coastal navigation"
            active={active === 'coastal-navigation'}
            onClick={() => setActive('coastal-navigation')}
          />
          <PageNavItem
            level={2}
            label="Offshore navigation"
            active={active === 'offshore-navigation'}
            onClick={() => setActive('offshore-navigation')}
          />
        </PageNavItem>
        <PageNavItem
          level={1}
          label="Anchoring"
          active={active === 'anchoring'}
          onClick={() => setActive('anchoring')}
        />
      </PageNavItem>
    </div>
  );
};
