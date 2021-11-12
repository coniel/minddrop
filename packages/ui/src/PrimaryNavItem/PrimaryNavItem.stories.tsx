/* eslint-disable no-console */
import React from 'react';
import { Settings } from '@minddrop/icons';
import { PrimaryNavItem } from './PrimaryNavItem';

export default {
  title: 'ui/PrimaryNavItem',
  component: PrimaryNavItem,
};

export const Default: React.FC = () => (
  <div>
    <PrimaryNavItem
      label="Settings"
      icon={<Settings />}
      onClick={() => console.log('Clicked')}
    />
    <PrimaryNavItem active label="Settings" icon={<Settings />} />
  </div>
);
