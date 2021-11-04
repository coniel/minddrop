---
to: packages/docs/components/demos/<%= name %>Demo.jsx
---
import React from 'react';
import { <%= name %> } from '@minddrop/ui';

export const <%= name %>Demo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <<%= name %>><%= name %></<%= name %>>
  </div>
);

export default <%= name %>Demo;
