import React from 'react';
import '../tests/setup-stories';
import { AppSidebar } from './AppSidebar';

export default {
  title: 'app/AppSidebar',
  component: AppSidebar,
};

export const Default: React.FC = () => (
  <div
    style={{ height: '100%', width: '100%', marginTop: -16, marginLeft: -16 }}
  >
    <AppSidebar />
  </div>
);
