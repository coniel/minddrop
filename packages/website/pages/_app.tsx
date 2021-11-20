import '../styles/globals.css';
import '@minddrop/theme/dist/styles.css';
import '@minddrop/ui/dist/styles.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
