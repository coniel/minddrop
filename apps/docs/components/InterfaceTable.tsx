import React from 'react';
import { Box, Text, Code } from '@modulz/design-system';
import { RegionTable } from './RegionTable';

type InterfaceDef = {
  name: string;
  required?: boolean;
  type: string;
  description: string;
};

export function InterfaceTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: InterfaceDef[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);

  return (
    <RegionTable
      css={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
      aria-label={hasAriaLabel ? ariaLabel : 'Interface Properties'}
      aria-labelledby={ariaLabelledBy}
    >
      <thead>
        <tr>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Property
            </Text>
          </Box>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Type
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
        {data.map(({ name, type, required, description }) => (
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
              <Code>
                {name}
                {required ? '*' : null}
              </Code>
            </Box>
            <Box
              as="td"
              css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
            >
              <Code
                css={{
                  bc: '$gray4',
                  color: '$gray11',
                  display: 'inline-block',
                }}
              >
                {type.length < 30 || !type.includes('|')
                  ? type
                  : type.split('|').map((value, index) => (
                      <>
                        {index > 0 ? (
                          <>
                            <br />|
                          </>
                        ) : (
                          '|'
                        )}{' '}
                        {value}
                      </>
                    ))}
              </Code>
            </Box>
            <Box
              as="td"
              css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
            >
              {description}
            </Box>
          </tr>
        ))}
      </tbody>
    </RegionTable>
  );
}
