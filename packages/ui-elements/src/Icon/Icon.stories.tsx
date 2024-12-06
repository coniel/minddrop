import React from 'react';
import { IconsProvider, IconsConsumer, UiIconName } from '@minddrop/icons';
import { Tooltip } from '../Tooltip';
import { Icon } from './Icon';

export default {
  title: 'ui/Icon',
  component: Icon,
};

export const IconSet: React.FC = () => (
  <IconsProvider>
    <IconsConsumer>
      {({ UiIcons }) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 16,
            rowGap: 16,
          }}
        >
          {Object.keys(UiIcons).map((name) => (
            <Tooltip key={name} title={name}>
              <div
                role="button"
                onClick={() => navigator.clipboard.writeText(name)}
                style={{
                  border: '1px solid var(--borderNeutralSubtle)',
                  borderRadius: 'var(--radiusSm)',
                  height: 42,
                  padding: 8,
                }}
              >
                <Icon name={name as UiIconName} color="light" />
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </IconsConsumer>
  </IconsProvider>
);
