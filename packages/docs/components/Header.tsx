import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Text,
  Badge,
  Flex,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Separator,
  Link,
} from '@modulz/design-system';
import { MindDropLogo } from './MindDropLogo';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { ThemeToggle } from '@components/ThemeToggle';

export const Header = () => {
  const router = useRouter();
  const isExtensions = router.pathname.includes('/extensions');
  const isThemes = router.pathname.includes('/themes');
  const isApi = router.pathname.includes('/api');
  const isComponents = router.pathname.includes('/components');

  return (
    <Box as="header">
      <Container size="4">
        <Flex css={{ height: '$7', alignItems: 'center' }}>
          <NextLink href="/" passHref>
            <Box
              as="a"
              css={{
                color: '$hiContrast',
                display: 'inline-flex',
                '&:focus': { boxShadow: 'none' },
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0, 0, 0, 0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                MindDrop homepage
              </span>
              <MindDropLogo label="MindDrop Homepage" />
            </Box>
          </NextLink>
          <Flex
            css={{
              ml: '$3',
              alignItems: 'center',
              display: 'none',
              '@bp2': { display: 'flex' },
            }}
          >
            {isExtensions && (
              <>
                <Text size="2">Extensions</Text>
                <Badge variant="yellow" css={{ ml: '$2' }}>
                  Beta
                </Badge>
              </>
            )}
            {isThemes && (
              <>
                <Text size="2">Themes</Text>
                <Badge variant="yellow" css={{ ml: '$2' }}>
                  Beta
                </Badge>
              </>
            )}
            {isApi && (
              <>
                <Text size="2">API</Text>
                <Badge variant="yellow" css={{ ml: '$2' }}>
                  Beta
                </Badge>
              </>
            )}
            {isComponents && (
              <>
                <Text size="2">Components</Text>
                <Badge variant="yellow" css={{ ml: '$2' }}>
                  Beta
                </Badge>
              </>
            )}
          </Flex>
          <Flex css={{ ml: 'auto', gap: '$4', alignItems: 'center' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="2"
                  ghost
                  css={{
                    gap: '$1',
                    fontWeight: 400,
                    color: '$slate11',
                    mr: '-$2',
                  }}
                >
                  Docs
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() =>
                    router.push('/docs/extensions/getting-started/introduction')
                  }
                >
                  Extensions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    router.push('/docs/themes/getting-started/setup')
                  }
                >
                  Themes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    router.push('/docs/api/getting-started/introduction')
                  }
                >
                  API
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => router.push('/docs/ui/overview/introduction')}
                >
                  Components
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Separator orientation="vertical" />
            <NextLink href="/blog" passHref>
              <Link variant="subtle" css={{ fontSize: '$3' }}>
                Blog
              </Link>
            </NextLink>
            <Separator orientation="vertical" />
            <NextLink href="https://github.com/coniel/minddrop" passHref>
              <Link variant="subtle" css={{ fontSize: '$3' }}>
                GitHub
              </Link>
            </NextLink>
            <Separator orientation="vertical" />
            <ThemeToggle />
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
