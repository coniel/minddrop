import React from 'react';
import { ViewInstance, View } from '../types';

export const staticView: View = {
  id: 'static-view',
  type: 'static',
  component: () => <div />,
};

export const instanceView: View = {
  id: 'instance-view',
  type: 'instance',
  component: () => <div />,
};

export const unregisteredView: View = {
  id: 'unregistered-view',
  type: 'instance',
  component: () => <div />,
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

export const views = [staticView, instanceView];

export const viewInstances = [viewInstance1, viewInstance2];
