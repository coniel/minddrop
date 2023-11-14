import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { NavGroup } from '../NavGroup';
import { PageNavItem } from '../PageNavItem';
import { PrimaryNavItem } from '../PrimaryNavItem';
import { SecondaryNavItem } from '../SecondaryNavItem';
import { Toolbar } from '../Toolbar';
import { IconButton } from '../IconButton';

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
        style={{ display: 'flex', flexDirection: 'column', rowGap: 36 }}
      >
        <div />
        <NavGroup label="Main">
          <PrimaryNavItem
            label="Daily drops"
            icon="droplet"
            active={active === 'daily-drops'}
            onClick={() => setActive('daily-drops')}
          />
          <PrimaryNavItem
            label="Search"
            icon="search"
            active={active === 'search'}
            onClick={() => setActive('search')}
          />
        </NavGroup>
        <NavGroup title="Pages">
          <PageNavItem
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
          <SecondaryNavItem label="Add page" icon="plus" />
        </NavGroup>
        <NavGroup label="Utilities">
          <SecondaryNavItem
            label="Extensions"
            icon="cube"
            active={active === 'extensions'}
            onClick={() => setActive('extensions')}
          />
          <SecondaryNavItem
            label="Archive"
            icon="archive"
            active={active === 'archive'}
            onClick={() => setActive('archive')}
          />
          <SecondaryNavItem
            label="Trash"
            icon="trash"
            active={active === 'trash'}
            onClick={() => setActive('trash')}
          />
        </NavGroup>
        <div style={{ flex: 1 }} />
        <Toolbar style={{ padding: '8px 16px' }}>
          <IconButton icon="cloud-upload" label="Sync" color="light" />
          <IconButton icon="settings" label="Settings" color="light" />
          <IconButton icon="copy" label="New window" color="light" />
        </Toolbar>
      </Sidebar>
    </div>
  );
};
