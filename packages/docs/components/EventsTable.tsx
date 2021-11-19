import React from 'react';
import { Box, Text, Code } from '@modulz/design-system';
import { RegionTable } from './RegionTable';

type EventDef = {
  name: string;
  data: string;
  description: string;
};

export function EventsTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: EventDef[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);
  return (
    <RegionTable
      css={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
      aria-label={hasAriaLabel ? ariaLabel : 'Definitions'}
      aria-labelledby={ariaLabelledBy}
    >
      <thead>
        <tr>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Name
            </Text>
          </Box>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Data
            </Text>
          </Box>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Description
            </Text>
          </Box>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, data, description }) => (
          <tr key={name}>
            <Box
              as="td"
              css={{
                borderBottom: '1px solid $gray6',
                py: '$3',
                pr: '$4',
                whiteSpace: 'nowrap',
              }}
            >
              <Code>{name}</Code>
            </Box>
            <Box
              as="td"
              css={{
                borderBottom: '1px solid $gray6',
                py: '$3',
                pr: '$4',
                whiteSpace: 'nowrap',
              }}
            >
              <Code>{data}</Code>
            </Box>
            <Box
              as="td"
              css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
            >
              <Text>{description}</Text>
            </Box>
          </tr>
        ))}
      </tbody>
    </RegionTable>
  );
}
