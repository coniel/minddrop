import React from 'react';
import { AddDropMenu } from './AddDropMenu';

export default {
  title: 'app/AddDropMenu',
  component: AddDropMenu,
};

export const Default: React.FC = () => (
  <div>
    <AddDropMenu>Content</AddDropMenu>
  </div>
);
