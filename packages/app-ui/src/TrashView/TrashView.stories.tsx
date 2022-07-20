import React, { useEffect } from 'react';
import { TrashView } from './TrashView';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { initializeCore } from '@minddrop/core';

const { dropConfig, drop1, drop2, drop3 } = DROPS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

export default {
  title: 'app-ui/TrashView',
  component: TrashView,
};

export const Default: React.FC = () => {
  useEffect(() => {
    Drops.register(core, dropConfig);
    Drops.delete(core, drop1.id);
    Drops.delete(core, drop2.id);
    Drops.delete(core, drop3.id);
  }, []);

  return (
    <div style={{ margin: -16 }}>
      <TrashView />
    </div>
  );
};
