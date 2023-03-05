import React from 'react';
import { IconsProvider, IconsConsumer, IconName } from '@minddrop/icons';
import { Tooltip } from '../Tooltip';
import { Icon } from './Icon';

export default {
  title: 'ui/Icon',
  component: Icon,
};

export const IconSet: React.FC = () => (
  <IconsProvider>
    <IconsConsumer>
      {(icons) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 16,
            rowGap: 16,
          }}
        >
          {Object.keys(icons).map((name) => (
            <Tooltip key={name} delayDuration={0} title={name}>
              <div
                role="button"
                style={{
                  border: '1px solid var(--borderNeutralSubtle)',
                  borderRadius: 'var(--radiusSm)',
                  height: 42,
                  padding: 8,
                }}
              >
                <Icon name={name as IconName} color="light" />
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </IconsConsumer>
  </IconsProvider>
);
