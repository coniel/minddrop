import React from 'react';
import { InvisibleTextField } from './InvisibleTextField';

export default {
  title: 'ui/InvisibleTextField',
  component: InvisibleTextField,
};

export const Default: React.FC = () => (
  <div>
    <InvisibleTextField
      size="title"
      weight="semibold"
      label="Topic name"
      defaultValue="The book of tea"
      placeholder="Untitled"
    />
  </div>
);
