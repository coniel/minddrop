import React from 'react';
import NextLink from 'next/link';
import { Box, Text, Code } from '@modulz/design-system';
import { RegionTable } from './RegionTable';

type AcceptedType = {
  type: string;
  props?: string;
  url?: string;
};

type LocationsDef = {
  name: string;
  accepts: AcceptedType[];
  description: string;
};

const codeCss = {
  bc: '$gray4',
  color: '$gray12',
  display: 'inline-block',
  br: '$1',
};

export function LocationsTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: LocationsDef[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);

  return (
    <RegionTable
      css={{
        width: '100%',
        textAlign: 'left',
        borderCollapse: 'collapse',
        mb: '$6',
      }}
      aria-label={hasAriaLabel ? ariaLabel : 'Extensible UI Locations'}
      aria-labelledby={ariaLabelledBy}
    >
      <thead>
        <tr>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Location
            </Text>
          </Box>
          <Box
            as="th"
            css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
          >
            <Text size="2" css={{ color: '$gray11' }}>
              Accepts
            </Text>
          </Box>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, accepts, description }) => (
          <tr key={name}>
            <Box
              as="td"
              css={{
                borderBottom: '1px solid $gray6',
                py: '$3',
                pr: '$4',
              }}
            >
              <Code>{name}</Code>
              <Box css={{ py: '$3', pr: '$4', lineHeight: 1.4 }}>
                {description}
              </Box>
            </Box>
            <Box
              as="td"
              css={{ borderBottom: '1px solid $gray6', py: '$3', pr: '$4' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: 4,
                  alignItems: 'flex-start',
                }}
              >
                {accepts.map((accepted) =>
                  accepted.url ? (
                    <>
                      {accepted.props && (
                        <Code css={codeCss}>
                          {accepted.type}
                          {'<'}
                          <NextLink href={accepted.url}>
                            <Code
                              css={{
                                ...codeCss,
                                padding: 0,
                                cursor: 'pointer',
                                color: '$blue11',
                              }}
                            >
                              {accepted.props}
                            </Code>
                          </NextLink>
                          {'>'}
                        </Code>
                      )}
                      {!accepted.props && (
                        <NextLink href={accepted.url}>
                          <Code
                            css={{
                              ...codeCss,
                              cursor: 'pointer',
                              color: '$blue11',
                            }}
                          >
                            {accepted.type}
                          </Code>
                        </NextLink>
                      )}
                    </>
                  ) : (
                    <Code css={codeCss}>{accepted.type}</Code>
                  ),
                )}
              </div>
            </Box>
          </tr>
        ))}
      </tbody>
    </RegionTable>
  );
}
