import { Resources } from '@minddrop/resources';
import React from 'react';
import { ViewInstance, StaticViewConfig, InstanceViewConfig } from '../types';

export interface InstanceViewData {
  foo?: string;
}

export const staticViewConfig: StaticViewConfig = {
  id: 'static-view',
  type: 'static',
  component: () => <div />,
};

export const instanceViewConfig: InstanceViewConfig<InstanceViewData> = {
  id: 'instance-view',
  type: 'instance',
  dataSchema: { foo: { type: 'string' } },
  component: () => <div />,
};

export const viewInstance1: ViewInstance = Resources.generateDocument(
  'views:view-instance',
  {
    type: 'instance-view',
  },
);

export const viewInstance2: ViewInstance = Resources.generateDocument(
  'views:view-instance',
  {
    type: 'instance-view',
  },
);

export const viewConfigs = [staticViewConfig, instanceViewConfig];

export const viewInstances = [viewInstance1, viewInstance2];
