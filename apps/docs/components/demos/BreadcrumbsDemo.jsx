import React from 'react';
import { Breadcrumbs, Breadcrumb } from '@minddrop/ui';

export const BreadcrumbsDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Breadcrumbs
      style={{
        padding: '8px 40px 8px 16px',
        backgroundColor: 'var(--bgApp)',
        borderRadius: 'var(--radiusLg)',
      }}
    >
      <Breadcrumb label="Tea" />
      <Breadcrumb label="Books" />
      <Breadcrumb label="The Book Of Tea" />
    </Breadcrumbs>
  </div>
);

export default BreadcrumbsDemo;
