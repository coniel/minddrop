---
to: packages/ui/src/<%= name %>/<%= name %>.stories.tsx
---
import { <%= name %> } from './<%= name %>';

export default {
  title: 'ui/<%= name %>',
  component: <%= name %>,
};

export const Default: React.FC = () => (
  <div>
    <<%= name %>>Content</<%= name %>>
  </div>
);
