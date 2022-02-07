import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Grid,
  Text,
  Flex,
  Separator,
  Link,
} from '@modulz/design-system';
import { MindDropLogo } from './MindDropLogo';
import { ExternalIcon } from './ExternalIcon';

export const Footer = () => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  return (
    <Box as="footer" css={{ pb: '$9' }}>
      <Flex css={{ justifyContent: 'center', mb: '$9' }}>
        <Separator size="2" />
      </Flex>
      <Container size="3">
        <Grid
          css={{
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '$6',
            '& ul': { listStyle: 'none', margin: '0', padding: '0' },
            '@bp2': {
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '$3',
            },
          }}
        >
          <Flex
            css={{
              alignItems: 'center',
              '@bp2': {
                flexDirection: 'column',
                alignItems: 'start',
              },
            }}
          >
            {!isHome && (
              <NextLink href="/" passHref>
                <Box
                  as="a"
                  css={{
                    color: '$hiContrast',
                    display: 'inline-flex',
                    '&:focus': {
                      boxShadow: 'none',
                    },
                  }}
                >
                  <MindDropLogo label="MindDrop Homepage" />
                </Box>
              </NextLink>
            )}
          </Flex>
          <Box>
            <Text
              as="h6"
              size="3"
              css={{ fontWeight: 500, lineHeight: '20px' }}
            >
              Apps
            </Text>
            <ul>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <Link
                    href="https://minddrop.app"
                    variant="subtle"
                    target="_blank"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    MindDrop
                    <Flex as="span" css={{ ml: '$1', color: '$gray8' }}>
                      <ExternalIcon />
                    </Flex>
                  </Link>
                </Text>
              </li>
            </ul>
          </Box>
          <Box>
            <Text
              as="h6"
              size="3"
              css={{ fontWeight: 500, lineHeight: '20px' }}
            >
              Docs
            </Text>
            <ul>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <NextLink
                    href="/docs/extensions/getting-started/introduction"
                    passHref
                  >
                    <Link variant="subtle">Extensions</Link>
                  </NextLink>
                </Text>
              </li>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <NextLink href="/docs/themes/getting-started/setup" passHref>
                    <Link variant="subtle">Themes</Link>
                  </NextLink>
                </Text>
              </li>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <NextLink
                    href="/docs/api/getting-started/introduction"
                    passHref
                  >
                    <Link variant="subtle">API</Link>
                  </NextLink>
                </Text>
              </li>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <NextLink href="/docs/ui/overview/introduction" passHref>
                    <Link variant="subtle">Components</Link>
                  </NextLink>
                </Text>
              </li>
            </ul>
          </Box>
          <Box>
            <Text
              as="h6"
              size="3"
              css={{ fontWeight: 500, lineHeight: '20px' }}
            >
              Community
            </Text>
            <ul>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <Link
                    href="https://github.com/coniel/minddrop"
                    variant="subtle"
                    target="_blank"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    GitHub
                    <Flex as="span" css={{ ml: '$1', color: '$gray8' }}>
                      <ExternalIcon />
                    </Flex>
                  </Link>
                </Text>
              </li>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <Link
                    href="https://forums.minddrop.app"
                    variant="subtle"
                    target="_blank"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    Forums
                    <Flex as="span" css={{ ml: '$1', color: '$gray8' }}>
                      <ExternalIcon />
                    </Flex>
                  </Link>
                </Text>
              </li>
              <li>
                <Text as="p" size="3" css={{ mt: '$3', lineHeight: '20px' }}>
                  <Link
                    href="https://twitter.com/MindDropApp"
                    variant="subtle"
                    target="_blank"
                    css={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    Twitter
                    <Flex as="span" css={{ ml: '$1', color: '$gray8' }}>
                      <ExternalIcon />
                    </Flex>
                  </Link>
                </Text>
              </li>
            </ul>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};
