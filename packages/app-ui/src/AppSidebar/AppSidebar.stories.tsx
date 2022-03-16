import React from 'react';
import { AppSidebar } from './AppSidebar';
import '../test-utils/initialize-stories';

export default {
  title: 'app-ui/AppSidebar',
  component: AppSidebar,
};

export const Default: React.FC = () => (
  <div
    style={{ height: '100%', width: '100%', marginTop: -16, marginLeft: -16 }}
  >
    <AppSidebar />
  </div>
);
