import { createRegistry } from '@minddrop/stores';
import { DesignElementConfigRegisteredEvent } from './events';
import { DesignElementConfig } from './types';

export const DesignElementConfigsRegistry = createRegistry<DesignElementConfig>(
  'DesignsNext:DesignElementConfigs',
  'type',
  {
    label: 'design element config',
    events: { registered: DesignElementConfigRegisteredEvent },
  },
);
