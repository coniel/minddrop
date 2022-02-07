import React from 'react';
import { View, ViewInstance } from '@minddrop/views';

export const homeView: View = {
  id: 'app:home',
  type: 'static',
  component: () => <div />,
};

export const topicView: View = {
  id: 'app:topic',
  type: 'instance',
  component: () => <div />,
};

export const staticView: View = {
  id: 'static-view',
  type: 'static',
  component: () => <div />,
};

export const instanceView: View = {
  id: 'view-instance',
  type: 'instance',
  component: () => <div />,
};

export const unregisteredView: View = {
  id: 'unregistered-view',
  type: 'instance',
  component: () => <div />,
};

export const viewInstance1: ViewInstance = {
  id: 'view-instance1-id',
  view: 'view-instance',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const viewInstance2: ViewInstance = {
  id: 'view-instance2-id',
  view: 'view-instance',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const views = [homeView, topicView, staticView, instanceView];

export const viewInstances = [viewInstance1, viewInstance2];
