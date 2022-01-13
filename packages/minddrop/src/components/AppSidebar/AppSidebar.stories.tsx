import React from 'react';
import { AppSidebar } from './AppSidebar';
import { core } from '../../tests/initialize-app';

export default {
  title: 'app/AppSidebar',
  component: AppSidebar,
};

export const Default: React.FC = () => (
  <div
    style={{ height: '100%', width: '100%', marginTop: -16, marginLeft: -16 }}
  >
    <AppSidebar core={core} />
  </div>
);
