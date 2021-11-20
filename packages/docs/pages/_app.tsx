import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import {
  globalCss,
  darkTheme,
  DesignSystemProvider,
  Box,
} from '@modulz/design-system';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import { ExtensionsPage } from '@components/ExtensionsPage';
import { UiPage } from '@components/UiPage';
import { ThemesPage } from '@components/ThemesPage';
import { ApiPage } from '@components/ApiPage';
import { IconsProvider } from '@minddrop/icons';
import '@minddrop/theme/dist/styles.css';
import '@minddrop/ui/dist/styles.css';

const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  body: {
    margin: 0,
    backgroundColor: '$loContrast',
    fontFamily: '$untitled',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTextSizeAdjust: '100%',

    '.dark-theme &': {
      backgroundColor: '$mauve1',
    },
  },

  svg: {
    display: 'block',
    verticalAlign: 'middle',
  },

  'pre, code': { margin: 0, fontFamily: '$mono' },

  '::selection': {
    backgroundColor: '$violet5',
    color: '$violet12',
  },

  '#__next': {
    position: 'relative',
    zIndex: 0,
  },

  'h1, h2, h3, h4, h5': { fontWeight: 500 },

  '.language-tsx ': {
    color: '$violet12',
  },
});

function App({ Component, pageProps }: AppProps) {
  globalStyles();
  const router = useRouter();

  const isComponentsDocs = router.pathname.includes('/docs/ui');
  const isExtensionsDocs = router.pathname.includes('/docs/extensions');
  const isApiDocs = router.pathname.includes('/docs/api');
  const isThemesDocs = router.pathname.includes('/docs/themes');
  const IsNotADocPage =
    !isComponentsDocs && !isApiDocs && !isThemesDocs && !isExtensionsDocs;

  return (
    <DesignSystemProvider>
      <IconsProvider>
        <ThemeProvider
          disableTransitionOnChange
          attribute="class"
          value={{ light: 'light-theme', dark: darkTheme.className }}
          defaultTheme="system"
        >
          <Box
            css={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              boxShadow: IsNotADocPage ? 'none' : '0 0 0 1px $colors$mauve5',
              zIndex: 2,
              backgroundColor: '$loContrast',

              '.dark-theme &': {
                backgroundColor: '$mauve1',
              },
            }}
          >
            <Header />
          </Box>
          <Box css={{ pt: '$7', position: 'relative', zIndex: 1 }}>
            {isExtensionsDocs && (
              <ExtensionsPage>
                <Component {...pageProps} />
              </ExtensionsPage>
            )}
            {isComponentsDocs && (
              <UiPage>
                <Component {...pageProps} />
              </UiPage>
            )}
            {isApiDocs && (
              <ApiPage>
                <Component {...pageProps} />
              </ApiPage>
            )}
            {isThemesDocs && (
              <ThemesPage>
                <Component {...pageProps} />
              </ThemesPage>
            )}
            {!isExtensionsDocs &&
              !isComponentsDocs &&
              !isThemesDocs &&
              !isApiDocs && <Component {...pageProps} />}
          </Box>
          {IsNotADocPage && <Footer />}
        </ThemeProvider>
      </IconsProvider>
    </DesignSystemProvider>
  );
}

export default App;
