import { Updater } from 'electrobun/bun';

const DEV_SERVER_PORT = 5183;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

/**
 * Returns the URL to load for a view page, preferring the Vite dev
 * server when it is running on the dev channel.
 *
 * @param page - The page file name, e.g. 'index.html'.
 * @returns The URL to load.
 */
export async function resolveViewUrl(page: string): Promise<string> {
  const channel = await Updater.localInfo.channel();

  if (channel === 'dev') {
    try {
      await fetch(DEV_SERVER_URL, { method: 'HEAD' });
      console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);

      return `${DEV_SERVER_URL}/${page}`;
    } catch {
      console.log(
        "Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
      );
    }
  }

  return `views://mainview/${page}`;
}
