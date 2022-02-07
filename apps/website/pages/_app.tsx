import '@minddrop/theme/dist/styles.css';
import '@minddrop/ui/dist/styles.css';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute="class"
      value={{ light: 'light-theme', dark: 'dark-theme' }}
      defaultTheme="system"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
