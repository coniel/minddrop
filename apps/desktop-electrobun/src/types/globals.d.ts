interface ImportMetaEnv {
  /**
   * The commit the front end is served from, set by the Vite config
   * when the server starts.
   */
  readonly VITE_APP_REVISION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
