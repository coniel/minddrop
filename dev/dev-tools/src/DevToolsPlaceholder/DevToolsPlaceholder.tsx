import React from 'react';
import { Stack, Text } from '@minddrop/ui-primitives';
import './DevToolsPlaceholder.css';

export interface DevToolsPlaceholderProps {
  icon: string;
  title: string;
  description: string;
}

export const DevToolsPlaceholder: React.FC<DevToolsPlaceholderProps> = ({
  title,
  description,
}) => (
  <div className="dev-tools-placeholder">
    <Stack align="center" gap={2}>
      <Text size="lg" weight="semibold" color="muted">
        {title}
      </Text>
      <Text
        size="sm"
        color="subtle"
        style={{ maxWidth: 320, textAlign: 'center' }}
      >
        {description}
      </Text>
    </Stack>
  </div>
);
