import React from 'react';
import NextLink from 'next/link';
import {
  Section,
  Container,
  Heading,
  Paragraph,
  Box,
  Grid,
  Card,
  Text,
} from '@modulz/design-system';

export default function Home() {
  return (
    <Box>
      <Section
        size={{ '@initial': '2', '@bp2': '3' }}
        css={{
          pt: '$7',
          '@bp2': {
            pt: '$8',
          },
        }}
      >
        <Container size="2">
          <Heading size="3" css={{ mb: '$3', '@bp2': { ta: 'center' } }}>
            MindDrop Developer Docs
          </Heading>
          <Paragraph
            size="2"
            as="p"
            css={{
              mb: '$6',
              color: '$sage11',
              '@bp2': {
                ta: 'center',
                mb: '$7',
              },
            }}
          >
            Designed with with extensibility in mind, MindDrop features a
            powerful extensions and theming API with first class DX.
          </Paragraph>
          <Grid columns={{ '@bp2': '2' }} gap="5" css={{ mx: '-$4' }}>
            <NextLink
              href="/docs/extensions/getting-started/introduction"
              passHref
            >
              <Card as="a" variant="ghost">
                <Box css={{ p: '$4' }}>
                  <Heading css={{ fontWeight: 500, mb: '$2' }}>API</Heading>
                  <Text variant="gray" css={{ lineHeight: '23px' }}>
                    Easily extend MindDrop&apos;s core features with our
                    powerful extensions API.
                  </Text>
                </Box>
              </Card>
            </NextLink>
            <NextLink href="/docs/themes/getting-started/setup" passHref>
              <Card as="a" variant="ghost">
                <Box css={{ p: '$4' }}>
                  <Heading css={{ fontWeight: 500, mb: '$2' }}>Theming</Heading>
                  <Text variant="gray" css={{ lineHeight: '23px' }}>
                    Customize MindDrop&apos;s appearance with CSS based themes
                    and custom icon sets.
                  </Text>
                </Box>
              </Card>
            </NextLink>
            <Card
              as="a"
              variant="ghost"
              href="/docs/guides/getting-started/introduction"
            >
              <Box css={{ p: '$4' }}>
                <Heading css={{ fontWeight: 500, mb: '$2' }}>Guides</Heading>
                <Text variant="gray" css={{ lineHeight: '23px' }}>
                  Step by step guides for contributing to and extending
                  MindDrop.
                </Text>
              </Box>
            </Card>
            <Card as="a" variant="ghost" href="/docs/ui/overview/introduction">
              <Box css={{ p: '$4' }}>
                <Heading css={{ fontWeight: 500, mb: '$2' }}>
                  Components
                </Heading>
                <Text variant="gray" css={{ lineHeight: '23px' }}>
                  Use MindDrop&apos;s design system in your extensions.
                </Text>
              </Box>
            </Card>
          </Grid>
        </Container>
      </Section>
    </Box>
  );
}
