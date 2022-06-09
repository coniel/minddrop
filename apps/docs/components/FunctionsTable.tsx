import React from 'react';
import { Box, Text, Code } from '@modulz/design-system';
import { RegionTable } from './RegionTable';
import { CodeBlock } from './CodeBlock';

type FunctionsTable = {
  name: string;
  required?: boolean;
  type: string;
  description?: string;
};

export function FunctionsTable({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: FunctionsTable[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy);
  const longestName = data.reduce(
    (longest, item) =>
      item.name.length > longest ? item.name.length : longest,
    0,
  );
  // Column width is the longest name * character width + code padding + padding right;
  const nameColWidth = longestName * 8.125 + 6 + 20;

  return (
    <RegionTable
      css={{
        width: '100%',
        textAlign: 'left',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
      }}
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
    >
      <tbody>
        {data.map(({ name, type, required, description }) => (
          <>
            <tr key={name}>
              <Box
                as="td"
                css={{
                  borderBottom: description ? 'none' : '1px solid $gray6',
                  py: '$3',
                  pb: description ? 0 : '$3',
                  pr: '$4',
                  whiteSpace: 'nowrap',
                  width: nameColWidth,
                }}
              >
                <Code>
                  {name}
                  {required ? '*' : null}
                </Code>
              </Box>
              <Box
                as="td"
                css={{
                  borderBottom: description ? 'none' : '1px solid $gray6',
                  py: '$3',
                  pb: description ? 0 : '$3',
                  pr: '$4',
                  position: 'relative',
                }}
              >
                <div style={{ width: '100%', overflowX: 'scroll' }}>
                  <CodeBlock
                    value={type}
                    language="tsx"
                    css={{
                      bc: '$gray4',
                      py: '$1',
                      br: '$1',
                      px: '$1',
                      display: 'inline-block',
                    }}
                    // variant="violet"
                  />
                </div>
              </Box>
            </tr>
            {description && (
              <Box
                as="tr"
                css={{
                  borderBottom: '1px solid $gray6',
                }}
              >
                <td />
                <td>
                  <Box
                    css={{
                      py: '$2',
                      pb: '$3',
                    }}
                  >
                    <Text size="3" css={{ lineHeight: '20px' }}>
                      {description}
                    </Text>
                  </Box>
                </td>
              </Box>
            )}
          </>
        ))}
      </tbody>
    </RegionTable>
  );
}
