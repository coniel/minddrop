import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { NavGroup } from '../NavGroup';
import { TopicNavItem } from '../TopicNavItem';
import { PrimaryNavItem } from '../PrimaryNavItem';
import { SecondaryNavItem } from '../SecondaryNavItem';
import { Toolbar } from '../Toolbar';
import { IconButton } from '../IconButton';
import { Icon } from '../Icon';

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
            icon={<Icon name="drop" />}
            active={active === 'daily-drops'}
            onClick={() => setActive('daily-drops')}
          />
          <PrimaryNavItem
            label="Search"
            icon={<Icon name="search" />}
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
          <SecondaryNavItem label="Add topic" icon={<Icon name="add" />} />
        </NavGroup>
        <NavGroup label="Utilities">
          <SecondaryNavItem
            label="Extensions"
            icon={<Icon name="extension" />}
            active={active === 'extensions'}
            onClick={() => setActive('extensions')}
          />
          <SecondaryNavItem
            label="Archive"
            icon={<Icon name="archive" />}
            active={active === 'archive'}
            onClick={() => setActive('archive')}
          />
          <SecondaryNavItem
            label="Trash"
            icon={<Icon name="trash" />}
            active={active === 'trash'}
            onClick={() => setActive('trash')}
          />
        </NavGroup>
        <div style={{ flex: 1 }} />
        <Toolbar style={{ padding: '8px 16px' }}>
          <IconButton label="Sync" color="light">
            <Icon name="cloud-upload" />
          </IconButton>
          <IconButton label="Settings" color="light">
            <Icon name="settings" />
          </IconButton>
          <IconButton label="New window" color="light">
            <Icon name="duplicate" />
          </IconButton>
        </Toolbar>
      </Sidebar>
    </div>
  );
};
