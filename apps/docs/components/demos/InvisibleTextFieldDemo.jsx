import React from 'react';
import { InvisibleTextField } from '@minddrop/ui';

export const InvisibleTextFieldDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <InvisibleTextField
      label="Topic name"
      size="title"
      color="contrast"
      placeholder="Untitled"
      defaultValue="The book of tea"
    />
  </div>
);

export default InvisibleTextFieldDemo;
