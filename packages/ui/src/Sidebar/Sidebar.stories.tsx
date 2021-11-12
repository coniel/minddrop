import React, { useState } from 'react';
import {
  Archive,
  Drop,
  Extension,
  Search,
  Trash,
  Settings,
  Duplicate,
  CloudUpload,
} from '@minddrop/icons';
import { Sidebar } from './Sidebar';
import { NavGroup } from '../NavGroup';
import { TopicNavItem } from '../TopicNavItem';
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
            icon={<Drop />}
            active={active === 'daily-drops'}
            onClick={() => setActive('daily-drops')}
          />
          <PrimaryNavItem
            label="Search"
            icon={<Search />}
            active={active === 'search'}
            onClick={() => setActive('search')}
          />
        </NavGroup>
        <NavGroup title="Topics">
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
        </NavGroup>
        <NavGroup label="Utilities">
          <SecondaryNavItem
            label="Extensions"
            icon={<Extension />}
            active={active === 'extensions'}
            onClick={() => setActive('extensions')}
          />
          <SecondaryNavItem
            label="Archive"
            icon={<Archive />}
            active={active === 'archive'}
            onClick={() => setActive('archive')}
          />
          <SecondaryNavItem
            label="Trash"
            icon={<Trash />}
            active={active === 'trash'}
            onClick={() => setActive('trash')}
          />
        </NavGroup>
        <div style={{ flex: 1 }} />
        <Toolbar style={{ padding: '8px 16px' }}>
          <IconButton label="Sync" color="light">
            <CloudUpload />
          </IconButton>
          <IconButton label="Settings" color="light">
            <Settings />
          </IconButton>
          <IconButton label="New window" color="light">
            <Duplicate />
          </IconButton>
        </Toolbar>
      </Sidebar>
    </div>
  );
};
