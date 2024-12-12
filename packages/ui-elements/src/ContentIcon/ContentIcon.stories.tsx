import React from 'react';
import { IconsProvider, IconsConsumer, ContentIconName } from '@minddrop/icons';
import { ContentIcon } from './ContentIcon';

export default {
  title: 'ui/ContentIcon',
  component: ContentIcon,
};

export const IconSet: React.FC = () => (
  <IconsProvider>
    <IconsConsumer>
      {({ ContentIcons }) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 16,
            rowGap: 16,
          }}
        >
          {Object.keys(ContentIcons).map((name) => (
            <ContentIcon key={name} name={name as ContentIconName} />
          ))}
        </div>
      )}
    </IconsConsumer>
  </IconsProvider>
);
