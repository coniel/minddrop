import {
  Box,
  Text,
  Section,
  Grid,
  Code,
  Heading,
  Flex,
  Paragraph,
} from '@modulz/design-system';

export function ColorGrid() {
  return (
    <Section size="3">
      <Box>
        <Box css={{ height: 35, backgroundColor: '$hiContrast' }} />
        <Text css={{ color: '$hiContrast' }}>fewfwefwefw</Text>
        <Box css={{ height: 35, backgroundColor: '$canvas' }} />
      </Box>

      <Box css={{ py: '$7' }}>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            gap: 2,
            ai: 'center',
          }}
        >
          <Box />
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>1</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>2</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>3</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>4</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>5</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>6</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>7</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>8</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>9</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>10</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>11</Text>
          </Box>
          <Box css={{ ta: 'center', pb: '$2' }}>
            <Text css={{ fontSize: '$2', color: '$slate11' }}>12</Text>
          </Box>

          <Box>
            <Text css={{ fontSize: '$2' }}>Gray</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$gray1' }} />
          <Box css={{ height: 35, backgroundColor: '$gray2' }} />
          <Box css={{ height: 35, backgroundColor: '$gray3' }} />
          <Box css={{ height: 35, backgroundColor: '$gray4' }} />
          <Box css={{ height: 35, backgroundColor: '$gray5' }} />
          <Box css={{ height: 35, backgroundColor: '$gray6' }} />
          <Box css={{ height: 35, backgroundColor: '$gray7' }} />
          <Box css={{ height: 35, backgroundColor: '$gray8' }} />
          <Box css={{ height: 35, backgroundColor: '$gray9' }} />
          <Box css={{ height: 35, backgroundColor: '$gray10' }} />
          <Box css={{ height: 35, backgroundColor: '$gray11' }} />
          <Box css={{ height: 35, backgroundColor: '$gray12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Mauve</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$mauve1' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve2' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve3' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve4' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve5' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve6' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve7' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve8' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve9' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve10' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve11' }} />
          <Box css={{ height: 35, backgroundColor: '$mauve12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Slate</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$slate1' }} />
          <Box css={{ height: 35, backgroundColor: '$slate2' }} />
          <Box css={{ height: 35, backgroundColor: '$slate3' }} />
          <Box css={{ height: 35, backgroundColor: '$slate4' }} />
          <Box css={{ height: 35, backgroundColor: '$slate5' }} />
          <Box css={{ height: 35, backgroundColor: '$slate6' }} />
          <Box css={{ height: 35, backgroundColor: '$slate7' }} />
          <Box css={{ height: 35, backgroundColor: '$slate8' }} />
          <Box css={{ height: 35, backgroundColor: '$slate9' }} />
          <Box css={{ height: 35, backgroundColor: '$slate10' }} />
          <Box css={{ height: 35, backgroundColor: '$slate11' }} />
          <Box css={{ height: 35, backgroundColor: '$slate12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Sand</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$sand1' }} />
          <Box css={{ height: 35, backgroundColor: '$sand2' }} />
          <Box css={{ height: 35, backgroundColor: '$sand3' }} />
          <Box css={{ height: 35, backgroundColor: '$sand4' }} />
          <Box css={{ height: 35, backgroundColor: '$sand5' }} />
          <Box css={{ height: 35, backgroundColor: '$sand6' }} />
          <Box css={{ height: 35, backgroundColor: '$sand7' }} />
          <Box css={{ height: 35, backgroundColor: '$sand8' }} />
          <Box css={{ height: 35, backgroundColor: '$sand9' }} />
          <Box css={{ height: 35, backgroundColor: '$sand10' }} />
          <Box css={{ height: 35, backgroundColor: '$sand11' }} />
          <Box css={{ height: 35, backgroundColor: '$sand12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Red</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$red1' }} />
          <Box css={{ height: 35, backgroundColor: '$red2' }} />
          <Box css={{ height: 35, backgroundColor: '$red3' }} />
          <Box css={{ height: 35, backgroundColor: '$red4' }} />
          <Box css={{ height: 35, backgroundColor: '$red5' }} />
          <Box css={{ height: 35, backgroundColor: '$red6' }} />
          <Box css={{ height: 35, backgroundColor: '$red7' }} />
          <Box css={{ height: 35, backgroundColor: '$red8' }} />
          <Box css={{ height: 35, backgroundColor: '$red9' }} />
          <Box css={{ height: 35, backgroundColor: '$red10' }} />
          <Box css={{ height: 35, backgroundColor: '$red11' }} />
          <Box css={{ height: 35, backgroundColor: '$red12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Crimson</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$crimson1' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson2' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson3' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson4' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson5' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson6' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson7' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson8' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson9' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson10' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson11' }} />
          <Box css={{ height: 35, backgroundColor: '$crimson12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Pink</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$pink1' }} />
          <Box css={{ height: 35, backgroundColor: '$pink2' }} />
          <Box css={{ height: 35, backgroundColor: '$pink3' }} />
          <Box css={{ height: 35, backgroundColor: '$pink4' }} />
          <Box css={{ height: 35, backgroundColor: '$pink5' }} />
          <Box css={{ height: 35, backgroundColor: '$pink6' }} />
          <Box css={{ height: 35, backgroundColor: '$pink7' }} />
          <Box css={{ height: 35, backgroundColor: '$pink8' }} />
          <Box css={{ height: 35, backgroundColor: '$pink9' }} />
          <Box css={{ height: 35, backgroundColor: '$pink10' }} />
          <Box css={{ height: 35, backgroundColor: '$pink11' }} />
          <Box css={{ height: 35, backgroundColor: '$pink12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Purple</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$purple1' }} />
          <Box css={{ height: 35, backgroundColor: '$purple2' }} />
          <Box css={{ height: 35, backgroundColor: '$purple3' }} />
          <Box css={{ height: 35, backgroundColor: '$purple4' }} />
          <Box css={{ height: 35, backgroundColor: '$purple5' }} />
          <Box css={{ height: 35, backgroundColor: '$purple6' }} />
          <Box css={{ height: 35, backgroundColor: '$purple7' }} />
          <Box css={{ height: 35, backgroundColor: '$purple8' }} />
          <Box css={{ height: 35, backgroundColor: '$purple9' }} />
          <Box css={{ height: 35, backgroundColor: '$purple10' }} />
          <Box css={{ height: 35, backgroundColor: '$purple11' }} />
          <Box css={{ height: 35, backgroundColor: '$purple12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Violet</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$violet1' }} />
          <Box css={{ height: 35, backgroundColor: '$violet2' }} />
          <Box css={{ height: 35, backgroundColor: '$violet3' }} />
          <Box css={{ height: 35, backgroundColor: '$violet4' }} />
          <Box css={{ height: 35, backgroundColor: '$violet5' }} />
          <Box css={{ height: 35, backgroundColor: '$violet6' }} />
          <Box css={{ height: 35, backgroundColor: '$violet7' }} />
          <Box css={{ height: 35, backgroundColor: '$violet8' }} />
          <Box css={{ height: 35, backgroundColor: '$violet9' }} />
          <Box css={{ height: 35, backgroundColor: '$violet10' }} />
          <Box css={{ height: 35, backgroundColor: '$violet11' }} />
          <Box css={{ height: 35, backgroundColor: '$violet12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Indigo</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$indigo1' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo2' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo3' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo4' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo5' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo6' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo7' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo8' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo9' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo10' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo11' }} />
          <Box css={{ height: 35, backgroundColor: '$indigo12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Blue</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$blue1' }} />
          <Box css={{ height: 35, backgroundColor: '$blue2' }} />
          <Box css={{ height: 35, backgroundColor: '$blue3' }} />
          <Box css={{ height: 35, backgroundColor: '$blue4' }} />
          <Box css={{ height: 35, backgroundColor: '$blue5' }} />
          <Box css={{ height: 35, backgroundColor: '$blue6' }} />
          <Box css={{ height: 35, backgroundColor: '$blue7' }} />
          <Box css={{ height: 35, backgroundColor: '$blue8' }} />
          <Box css={{ height: 35, backgroundColor: '$blue9' }} />
          <Box css={{ height: 35, backgroundColor: '$blue10' }} />
          <Box css={{ height: 35, backgroundColor: '$blue11' }} />
          <Box css={{ height: 35, backgroundColor: '$blue12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Cyan</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$cyan1' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan2' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan3' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan4' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan5' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan6' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan7' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan8' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan9' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan10' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan11' }} />
          <Box css={{ height: 35, backgroundColor: '$cyan12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Teal</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$teal1' }} />
          <Box css={{ height: 35, backgroundColor: '$teal2' }} />
          <Box css={{ height: 35, backgroundColor: '$teal3' }} />
          <Box css={{ height: 35, backgroundColor: '$teal4' }} />
          <Box css={{ height: 35, backgroundColor: '$teal5' }} />
          <Box css={{ height: 35, backgroundColor: '$teal6' }} />
          <Box css={{ height: 35, backgroundColor: '$teal7' }} />
          <Box css={{ height: 35, backgroundColor: '$teal8' }} />
          <Box css={{ height: 35, backgroundColor: '$teal9' }} />
          <Box css={{ height: 35, backgroundColor: '$teal10' }} />
          <Box css={{ height: 35, backgroundColor: '$teal11' }} />
          <Box css={{ height: 35, backgroundColor: '$teal12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Green</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$green1' }} />
          <Box css={{ height: 35, backgroundColor: '$green2' }} />
          <Box css={{ height: 35, backgroundColor: '$green3' }} />
          <Box css={{ height: 35, backgroundColor: '$green4' }} />
          <Box css={{ height: 35, backgroundColor: '$green5' }} />
          <Box css={{ height: 35, backgroundColor: '$green6' }} />
          <Box css={{ height: 35, backgroundColor: '$green7' }} />
          <Box css={{ height: 35, backgroundColor: '$green8' }} />
          <Box css={{ height: 35, backgroundColor: '$green9' }} />
          <Box css={{ height: 35, backgroundColor: '$green10' }} />
          <Box css={{ height: 35, backgroundColor: '$green11' }} />
          <Box css={{ height: 35, backgroundColor: '$green12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Lime</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$lime1' }} />
          <Box css={{ height: 35, backgroundColor: '$lime2' }} />
          <Box css={{ height: 35, backgroundColor: '$lime3' }} />
          <Box css={{ height: 35, backgroundColor: '$lime4' }} />
          <Box css={{ height: 35, backgroundColor: '$lime5' }} />
          <Box css={{ height: 35, backgroundColor: '$lime6' }} />
          <Box css={{ height: 35, backgroundColor: '$lime7' }} />
          <Box css={{ height: 35, backgroundColor: '$lime8' }} />
          <Box css={{ height: 35, backgroundColor: '$lime9' }} />
          <Box css={{ height: 35, backgroundColor: '$lime10' }} />
          <Box css={{ height: 35, backgroundColor: '$lime11' }} />
          <Box css={{ height: 35, backgroundColor: '$lime12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Yellow</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$yellow1' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow2' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow3' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow4' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow5' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow6' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow7' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow8' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow9' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow10' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow11' }} />
          <Box css={{ height: 35, backgroundColor: '$yellow12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Orange</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$orange1' }} />
          <Box css={{ height: 35, backgroundColor: '$orange2' }} />
          <Box css={{ height: 35, backgroundColor: '$orange3' }} />
          <Box css={{ height: 35, backgroundColor: '$orange4' }} />
          <Box css={{ height: 35, backgroundColor: '$orange5' }} />
          <Box css={{ height: 35, backgroundColor: '$orange6' }} />
          <Box css={{ height: 35, backgroundColor: '$orange7' }} />
          <Box css={{ height: 35, backgroundColor: '$orange8' }} />
          <Box css={{ height: 35, backgroundColor: '$orange9' }} />
          <Box css={{ height: 35, backgroundColor: '$orange10' }} />
          <Box css={{ height: 35, backgroundColor: '$orange11' }} />
          <Box css={{ height: 35, backgroundColor: '$orange12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Gold</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$gold1' }} />
          <Box css={{ height: 35, backgroundColor: '$gold2' }} />
          <Box css={{ height: 35, backgroundColor: '$gold3' }} />
          <Box css={{ height: 35, backgroundColor: '$gold4' }} />
          <Box css={{ height: 35, backgroundColor: '$gold5' }} />
          <Box css={{ height: 35, backgroundColor: '$gold6' }} />
          <Box css={{ height: 35, backgroundColor: '$gold7' }} />
          <Box css={{ height: 35, backgroundColor: '$gold8' }} />
          <Box css={{ height: 35, backgroundColor: '$gold9' }} />
          <Box css={{ height: 35, backgroundColor: '$gold10' }} />
          <Box css={{ height: 35, backgroundColor: '$gold11' }} />
          <Box css={{ height: 35, backgroundColor: '$gold12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Brown</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$brown1' }} />
          <Box css={{ height: 35, backgroundColor: '$brown2' }} />
          <Box css={{ height: 35, backgroundColor: '$brown3' }} />
          <Box css={{ height: 35, backgroundColor: '$brown4' }} />
          <Box css={{ height: 35, backgroundColor: '$brown5' }} />
          <Box css={{ height: 35, backgroundColor: '$brown6' }} />
          <Box css={{ height: 35, backgroundColor: '$brown7' }} />
          <Box css={{ height: 35, backgroundColor: '$brown8' }} />
          <Box css={{ height: 35, backgroundColor: '$brown9' }} />
          <Box css={{ height: 35, backgroundColor: '$brown10' }} />
          <Box css={{ height: 35, backgroundColor: '$brown11' }} />
          <Box css={{ height: 35, backgroundColor: '$brown12' }} />

          <Box>
            <Text css={{ fontSize: '$2' }}>Bronze</Text>
          </Box>
          <Box css={{ height: 35, backgroundColor: '$bronze1' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze2' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze3' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze4' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze5' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze6' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze7' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze8' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze9' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze10' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze11' }} />
          <Box css={{ height: 35, backgroundColor: '$bronze12' }} />
        </Grid>
      </Box>

      <Box>
        <Box as="ol" css={{ my: '$3' }}>
          <li>
            <Text size="3" css={{ color: '$hiContrast', lineHeight: '25px' }}>
              Step 1: Subtle backgrounds
            </Text>
          </li>
          <li>
            <Text size="3" css={{ color: '$hiContrast', lineHeight: '25px' }}>
              Steps 2–4: Interactive backgrounds
            </Text>
          </li>
          <li>
            <Text size="3" css={{ color: '$hiContrast', lineHeight: '25px' }}>
              Step 5: Separators
            </Text>
          </li>
          <li>
            <Text size="3" css={{ color: '$hiContrast', lineHeight: '25px' }}>
              Steps 6–7: Borders
            </Text>
          </li>
          <li>
            <Text size="3" css={{ color: '$hiContrast', lineHeight: '25px' }}>
              Step 8: Backgrounds
            </Text>
          </li>
          <li>
            <Text size="3" css={{ color: '$hiContrast', lineHeight: '25px' }}>
              Step 9: Text
            </Text>
          </li>
        </Box>
      </Box>

      <Box>
        <Text
          size="6"
          as="h4"
          css={{ fontWeight: 500, lineHeight: '27px', mt: '$8', mb: '$1' }}
        >
          Warm & cool hues
        </Text>
        <Paragraph css={{ mb: '$7' }}>
          There are 8 warm hues and 8 cool hues. All <Code>9</Code> colors
          should be balanced optically, especially if they are adjacent on the
          spectrum.
        </Paragraph>
      </Box>

      <Box>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
            gap: 2,
            ai: 'center',
          }}
        >
          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$slate11' }}>
              Warm
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$yellow10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$orange10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$gold10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$brown10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$bronze10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$red10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$crimson10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$pink10',
            }}
          />
          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$slate11' }}>
              Cool
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$purple10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$violet10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$indigo10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$blue10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$cyan10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$teal10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$green10',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$lime10',
            }}
          />
        </Grid>
      </Box>

      <Box>
        <Paragraph css={{ my: '$7' }}>
          All <Code>200</Code> colors should be balanced optically, especially
          if they are adjacent on the spectrum.
        </Paragraph>
      </Box>

      <Box>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
            gap: 2,
            ai: 'center',
          }}
        >
          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$slate11' }}>
              Warm
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$yellow4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$orange4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$gold4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$brown4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$bronze4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$red4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$crimson4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$pink4',
            }}
          />
          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$slate11' }}>
              Cool
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$purple4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$violet4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$indigo4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$blue4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$cyan4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$teal4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$green4',
            }}
          />
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$lime4',
            }}
          />
        </Grid>
      </Box>

      <Box>
        <Text
          size="6"
          as="h4"
          css={{ fontWeight: 500, lineHeight: '27px', mt: '$8', mb: '$1' }}
        >
          Text color test
        </Text>
        <Paragraph css={{ mb: '$7' }}>
          The <Code>11</Code> text color should look good and pass AA on all
          background colors. Text should also pass on the <Code>9</Code>{' '}
          backgrounds.
        </Paragraph>
      </Box>

      <Box>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 2,
            ai: 'center',
          }}
        >
          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$red11' }}>
              Red
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$red100',
            }}
          >
            <Text size="3" css={{ color: '$red11' }}>
              Red
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$red4',
            }}
          >
            <Text size="3" css={{ color: '$red11' }}>
              Red
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$red10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Red
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$crimson11' }}>
              Crimson
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$crimson100',
            }}
          >
            <Text size="3" css={{ color: '$crimson11' }}>
              Crimson
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$crimson4',
            }}
          >
            <Text size="3" css={{ color: '$crimson11' }}>
              Crimson
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$crimson10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Crimson
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$pink11' }}>
              Pink
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$pink100',
            }}
          >
            <Text size="3" css={{ color: '$pink11' }}>
              Pink
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$pink4',
            }}
          >
            <Text size="3" css={{ color: '$pink11' }}>
              Pink
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$pink10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Pink
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$purple11' }}>
              Purple
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$purple100',
            }}
          >
            <Text size="3" css={{ color: '$purple11' }}>
              Purple
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$purple4',
            }}
          >
            <Text size="3" css={{ color: '$purple11' }}>
              Purple
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$purple10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Purple
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$violet11' }}>
              Violet
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$violet100',
            }}
          >
            <Text size="3" css={{ color: '$violet11' }}>
              Violet
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$violet4',
            }}
          >
            <Text size="3" css={{ color: '$violet11' }}>
              Violet
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$violet10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Violet
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$indigo11' }}>
              Indigo
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$indigo100',
            }}
          >
            <Text size="3" css={{ color: '$indigo11' }}>
              Indigo
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$indigo4',
            }}
          >
            <Text size="3" css={{ color: '$indigo11' }}>
              Indigo
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$indigo10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Indigo
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$blue11' }}>
              Blue
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$blue100',
            }}
          >
            <Text size="3" css={{ color: '$blue11' }}>
              Blue
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$blue4',
            }}
          >
            <Text size="3" css={{ color: '$blue11' }}>
              Blue
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$blue10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Blue
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$cyan11' }}>
              cyan
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$cyan100',
            }}
          >
            <Text size="3" css={{ color: '$cyan11' }}>
              cyan
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$cyan4',
            }}
          >
            <Text size="3" css={{ color: '$cyan11' }}>
              cyan
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$cyan10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              cyan
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$teal11' }}>
              Teal
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$teal100',
            }}
          >
            <Text size="3" css={{ color: '$teal11' }}>
              Teal
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$teal4',
            }}
          >
            <Text size="3" css={{ color: '$teal11' }}>
              Teal
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$teal10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Teal
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$green11' }}>
              Green
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$green100',
            }}
          >
            <Text size="3" css={{ color: '$green11' }}>
              Green
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$green4',
            }}
          >
            <Text size="3" css={{ color: '$green11' }}>
              Green
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$green10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Green
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$lime11' }}>
              Lime
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$lime100',
            }}
          >
            <Text size="3" css={{ color: '$lime11' }}>
              Lime
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$lime4',
            }}
          >
            <Text size="3" css={{ color: '$lime11' }}>
              Lime
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$lime10',
            }}
          >
            <Text size="3" css={{ color: 'black' }}>
              Lime
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$yellow11' }}>
              Yellow
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$yellow100',
            }}
          >
            <Text size="3" css={{ color: '$yellow11' }}>
              Yellow
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$yellow4',
            }}
          >
            <Text size="3" css={{ color: '$yellow11' }}>
              Yellow
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$yellow10',
            }}
          >
            <Text size="3" css={{ color: 'black' }}>
              Yellow
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$orange11' }}>
              Orange
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$orange100',
            }}
          >
            <Text size="3" css={{ color: '$orange11' }}>
              Orange
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$orange4',
            }}
          >
            <Text size="3" css={{ color: '$orange11' }}>
              Orange
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$orange10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Orange
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$bronze11' }}>
              Bronze
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$bronze100',
            }}
          >
            <Text size="3" css={{ color: '$bronze11' }}>
              Bronze
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$bronze4',
            }}
          >
            <Text size="3" css={{ color: '$bronze11' }}>
              Bronze
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$bronze10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Bronze
            </Text>
          </Flex>

          <Flex css={{ ai: 'center', jc: 'center', height: 100 }}>
            <Text size="3" css={{ color: '$gold11' }}>
              Gold
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$gold100',
            }}
          >
            <Text size="3" css={{ color: '$gold11' }}>
              Gold
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$gold4',
            }}
          >
            <Text size="3" css={{ color: '$gold11' }}>
              Gold
            </Text>
          </Flex>
          <Flex
            css={{
              ai: 'center',
              jc: 'center',
              height: 100,
              backgroundColor: '$gold10',
            }}
          >
            <Text size="3" css={{ color: 'white' }}>
              Gold
            </Text>
          </Flex>
        </Grid>
      </Box>

      <Box>
        <Text
          size="6"
          as="h4"
          css={{ fontWeight: 500, lineHeight: '27px', mt: '$8', mb: '$1' }}
        >
          Lines
        </Text>
        <Paragraph css={{ mb: '$7' }}>
          The <Code>500</Code> line should be very subtle, but visible on all
          backgrounds.
        </Paragraph>
      </Box>

      <Box>
        <Flex css={{ position: 'relative' }}>
          <Box
            css={{
              fb: '0',
              fg: '1',
              height: 160,
              backgroundColor: '$loContrast',
            }}
          />
          <Box
            css={{ fb: '0', fg: '1', height: 160, backgroundColor: '$slate1' }}
          />
          <Box
            css={{ fb: '0', fg: '1', height: 160, backgroundColor: '$slate2' }}
          />
          <Box
            css={{ fb: '0', fg: '1', height: 160, backgroundColor: '$slate3' }}
          />
          <Box
            css={{ fb: '0', fg: '1', height: 160, backgroundColor: '$slate4' }}
          />
          <Box
            css={{
              sition: 'absolute',
              p: '50%',
              ft: '0',
              width: '100%',
              height: 1,
              backgroundColor: '$slate7',
            }}
          />
        </Flex>
      </Box>

      <Box>
        <Paragraph css={{ my: '$7' }}>
          These <Code>500</Code> lines should have a nice constrast against the{' '}
          <Code>100</Code> background. Make sure the borders don&apos;t look too
          harsh or vibrant.
        </Paragraph>
      </Box>

      <Box>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '$7',
            ai: 'center',
          }}
        >
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$red100',
              border: '1px solid $red7',
            }}
          >
            <Text size="3" as="p" css={{ color: '$red11', lineHeight: '23px' }}>
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$crimson100',
              border: '1px solid $red7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$crimson11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$pink100',
              border: '1px solid $pink7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$pink11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$purple100',
              border: '1px solid $purple7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$purple11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$violet100',
              border: '1px solid $violet7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$violet11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$indigo100',
              border: '1px solid $indigo7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$indigo11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$blue100',
              border: '1px solid $blue7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$blue11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$cyan100',
              border: '1px solid $cyan7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$cyan11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$teal100',
              border: '1px solid $teal7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$teal11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$green100',
              border: '1px solid $green7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$green11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$lime100',
              border: '1px solid $lime7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$lime11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$yellow100',
              border: '1px solid $yellow7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$yellow11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$orange100',
              border: '1px solid $orange7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$orange11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$bronze100',
              border: '1px solid $bronze7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$bronze11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
          <Box
            css={{
              p: '$3',
              borderRadius: '$3',
              backgroundColor: '$gold100',
              border: '1px solid $gold7',
            }}
          >
            <Text
              size="3"
              as="p"
              css={{ color: '$gold11', lineHeight: '23px' }}
            >
              Warning: obsessing over color is a terrible idea. Chill down ffs.
            </Text>
          </Box>
        </Grid>
      </Box>

      <Box
        css={{ backgroundColor: '$red10', height: '100vh', p: '$9', mt: '$9' }}
      >
        <Heading size="4" css={{ color: 'white' }}>
          This should look good and pass contrast ratio.
        </Heading>
      </Box>
    </Section>
  );
}
