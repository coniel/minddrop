import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { Breadcrumbs } from './Breadcrumbs';

export default {
  title: 'ui/Breadcrumbs',
  component: Breadcrumbs,
};

export const Default: React.FC = () => (
  <div>
    <Breadcrumbs>
      <Breadcrumb label="Tea" />
      <Breadcrumb label="Books" />
      <Breadcrumb label="The Book of Tea" />
    </Breadcrumbs>
  </div>
);
