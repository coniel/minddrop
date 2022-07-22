---
to: packages/app-ui/src/<%= name %>/<%= name %>.stories.tsx
---
import React from 'react';
import { <%= name %> } from './<%= name %>';

export default {
  title: 'app-ui/<%= name %>',
  component: <%= name %>,
};

export const Default: React.FC = () => (
  <div>
    <<%= name %>>Content</<%= name %>>
  </div>
);
