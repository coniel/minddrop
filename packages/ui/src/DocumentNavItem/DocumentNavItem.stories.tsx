import React, { useState } from 'react';
import { DocumentNavItem } from './DocumentNavItem';

export default {
  title: 'ui/DocumentNavItem',
  component: DocumentNavItem,
};

export const Default: React.FC = () => {
  const [active, setActive] = useState('home');

  return (
    <div style={{ maxWidth: 260 }}>
      <DocumentNavItem
        label="Home"
        active={active === 'home'}
        onClick={() => setActive('home')}
      />
      <DocumentNavItem
        label="Sailing"
        active={active === 'sailing'}
        onClick={() => setActive('sailing')}
      >
        <DocumentNavItem
          level={1}
          label="Sailboats"
          active={active === 'sailboats'}
          onClick={() => setActive('sailboats')}
        />
        <DocumentNavItem
          level={1}
          active={active === 'sails'}
          label="Sails"
          onClick={() => setActive('sails')}
        />
        <DocumentNavItem
          level={1}
          label="Navigation"
          active={active === 'navigation'}
          onClick={() => setActive('navigation')}
        >
          <DocumentNavItem
            level={2}
            label="Coastal navigation"
            active={active === 'coastal-navigation'}
            onClick={() => setActive('coastal-navigation')}
          />
          <DocumentNavItem
            level={2}
            label="Offshore navigation"
            active={active === 'offshore-navigation'}
            onClick={() => setActive('offshore-navigation')}
          />
        </DocumentNavItem>
        <DocumentNavItem
          level={1}
          label="Anchoring"
          active={active === 'anchoring'}
          onClick={() => setActive('anchoring')}
        />
      </DocumentNavItem>
    </div>
  );
};
