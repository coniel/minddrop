import React from 'react';
import { Box, Text, Code } from '@modulz/design-system';
import { RegionTable } from './RegionTable';

type InterfaceDef = {
  name: string;
  required?: boolean;
  type: string;
  description: string;
};

const coreDef: InterfaceDef = {
  name: 'core',
  type: 'Core',
  required: true,
  description: 'A MindDrop core instance.',
};

export function ArgsTable({
  data: dataProp = [],
  core,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: InterfaceDef[];
  core?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);
  const data = core ? [coreDef, ...dataProp] : dataProp;

  return (
    <RegionTable
      css={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}
      aria-label={hasAriaLabel ? ariaLabel : 'Function arguments'}
      aria-labelledby={ariaLabelledBy}
    >
      <thead>
        <tr>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Argument
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
