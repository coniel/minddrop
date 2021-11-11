import React from 'react';
import { Sidebar } from '@minddrop/ui';

export const SidebarDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div
      style={{
        height: 150,
        flex: 1,
        width: 400,
        backgroundColor: 'var(--bgApp)',
        borderRadius: 6,
      }}
    >
      <Sidebar initialWidth={150} minWidth={100} maxWidth={300} />
    </div>
  </div>
);

export default SidebarDemo;
