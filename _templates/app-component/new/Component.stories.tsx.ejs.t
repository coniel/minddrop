---
to: packages/minddrop/src/components/<%= name %>/<%= name %>.stories.tsx
---
import React from 'react';
import { <%= name %> } from './<%= name %>';

export default {
  title: 'app/<%= name %>',
  component: <%= name %>,
};

export const Default: React.FC = () => (
  <div>
    <<%= name %>>Content</<%= name %>>
  </div>
);