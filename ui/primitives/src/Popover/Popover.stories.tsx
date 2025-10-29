import React from 'react';
import { Button } from '../Button';
import { InvisibleTextField } from '../InvisibleTextField';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export default {
  title: 'ui/Popover',
  component: Popover,
};

export const Default: React.FC = () => (
  <div>
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
