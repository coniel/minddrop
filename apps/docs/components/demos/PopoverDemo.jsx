import React from 'react';
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  InvisibleTextField,
} from '@minddrop/ui';

export const PopoverDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Popover>
      <PopoverTrigger>
        <Button>Rename topic</Button>
      </PopoverTrigger>

      <PopoverContent sideOffset={-6}>
        <InvisibleTextField
          style={{ padding: '4px 8px' }}
          label="Topic name"
          placeholder="Untitled"
          defaultValue="The book of tea"
          size="large"
        />
      </PopoverContent>
    </Popover>
  </div>
);

export default PopoverDemo;
