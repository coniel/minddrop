import React from 'react';
import { ViewInstance, View, ViewConfig } from '../types';

export const staticViewConfig: ViewConfig = {
  id: 'static-view',
  type: 'static',
  component: () => <div />,
};

export const instanceViewConfig: ViewConfig = {
  id: 'instance-view',
  type: 'instance',
  component: () => <div />,
};

export const unregisteredViewConfig: ViewConfig = {
  id: 'unregistered-view',
  type: 'instance',
  component: () => <div />,
};

export const staticView: View = {
  extension: 'views',
  ...staticViewConfig,
};

export const instanceView: View = {
  extension: 'views',
  ...instanceViewConfig,
};

export const unregisteredView: View = {
  extension: 'views',
  ...unregisteredViewConfig,
};

export const viewInstance1: ViewInstance = {
  id: 'view-instance-1',
  view: 'instance-view',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const viewInstance2: ViewInstance = {
  id: 'view-instance-2',
  view: 'instance-view',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const viewConfigs = [staticViewConfig, instanceViewConfig];

export const viewInstances = [viewInstance1, viewInstance2];
