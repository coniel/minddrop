import React from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import { Box } from '@modulz/design-system';
import { TitleAndMetaTags } from '@components/TitleAndMetaTags';
import { MDXProvider, components } from '@components/MDXComponents';
import { getAllFrontmatter, getMdxBySlug } from '@lib/mdx';
import { RemoveScroll } from 'react-remove-scroll';
import { QuickNav } from '@components/QuickNav';

import type { Frontmatter } from 'types/frontmatter';

type Doc = {
  frontmatter: Frontmatter;
  code: string;
};

export default function OverviewDoc({ frontmatter, code }: Doc) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <>
      <TitleAndMetaTags
        title={`${frontmatter.metaTitle} — MindDrop Docs`}
        description={frontmatter.metaDescription}
        image={frontmatter.metaImage}
      />

      <MDXProvider frontmatter={frontmatter}>
        <Component components={components as any} />
      </MDXProvider>

      <Box
        as="aside"
        // Components that hide the scrollbar (like Dialog) add padding to
        // account for the scrollbar gap to avoid layout jank. This does not
        // work for position: fixed elements. Since we use react-remove-scroll
        // under the hood for those extensions, we can add this helper class
        // provided by that lib to deal with that for the QuickNav.
        // https://github.com/coniel/minddrop/issues/64
        // https://github.com/theKashey/react-remove-scroll#positionfixed-elements
        className={RemoveScroll.classNames.zeroRight}
        css={{
          display: 'none',
          '@media (min-width: 1440px)': {
            display: 'block',
            width: 250,
            flexShrink: 0,
            zIndex: 1,
            position: 'fixed',
            top: '$sizes$7',
            right: 0,
            bottom: 0,
          },
        }}
      >
        <QuickNav key={frontmatter.slug} />
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const frontmatters = getAllFrontmatter('extensions/getting-started');

  return {
    paths: frontmatters.map((frontmatter) => ({
      params: {
        slug: frontmatter.slug.replace('extensions/getting-started/', ''),
      },
    })),
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { frontmatter, code } = await getMdxBySlug(
    'extensions/getting-started/',
    context.params.slug,
  );
  return { props: { frontmatter, code } };
}
