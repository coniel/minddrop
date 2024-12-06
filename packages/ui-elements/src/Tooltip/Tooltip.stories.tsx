import React from 'react';
import { Tooltip } from './Tooltip';

export default {
  title: 'ui/Tooltip',
  component: Tooltip,
};

export const Playground: React.FC = () => (
  <div>
    <div
      style={{
        margin: 40,
        width: 400,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Tooltip title="New drop">
        <button type="button">Title only</button>
      </Tooltip>
      <Tooltip title="New drop" keyboardShortcut={['Ctrl', 'N']}>
        <button type="button">Keyboard shortcut</button>
      </Tooltip>
      <Tooltip title="New drop" description="Create a new text drop.">
        <button type="button">Description</button>
      </Tooltip>
    </div>
    <div
      style={{
        margin: 40,
        width: 400,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Tooltip title="New drop" side="top">
        <button type="button">top</button>
      </Tooltip>
      <Tooltip title="New drop" side="left">
        <button type="button">left</button>
      </Tooltip>
      <Tooltip title="New drop" side="right">
        <button type="button">right</button>
      </Tooltip>
    </div>
  </div>
);

export const CollisionAvoidance: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Tooltip open title="New drop" side="left">
        <button type="button">left</button>
      </Tooltip>
      <Tooltip
        open
        title="New drop"
        side="top"
        keyboardShortcut={['Ctrl', 'N']}
      >
        <button type="button">top</button>
      </Tooltip>
      <Tooltip
        open
        title="New drop"
        side="right"
        description="Create a new text drop"
      >
        <button type="button">right</button>
      </Tooltip>
    </div>
    <div>
      <Tooltip open title="New drop" side="bottom">
        <button type="button">bottom</button>
      </Tooltip>
    </div>
  </div>
);
