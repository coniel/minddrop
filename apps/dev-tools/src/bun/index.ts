import { BrowserView, BrowserWindow, Updater } from 'electrobun/bun';
import { watch } from 'node:fs';
import { DevReviewRPC } from '../types';
import { rpcHandlers } from './rpc';

const DEV_SERVER_PORT = 5174;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;
// Resolve repo root dynamically via git (import.meta.dir points to
// the build output at runtime, not the source tree)
const REPO_ROOT = Bun.spawnSync(['git', 'rev-parse', '--show-toplevel'])
  .stdout.toString()
  .trim();
const CHANGES_DIR = `${REPO_ROOT}/dev/changes`;
const PLANS_DIR = `${REPO_ROOT}/dev/plans`;
const GIT_DIR = `${REPO_ROOT}/.git`;

// Create typed RPC for the webview
const rpc = BrowserView.defineRPC<DevReviewRPC>({
  maxRequestTime: 5000,
  handlers: {
    requests: rpcHandlers,
    messages: {
      '*': (messageName, payload) => {
        console.log('message from webview:', messageName, payload);
      },
    },
  },
});

// Check if Vite dev server is running for HMR
async function getViewUrl(): Promise<string> {
  const channel = await Updater.localInfo.channel();

  if (channel === 'dev') {
    try {
      await fetch(DEV_SERVER_URL, { method: 'HEAD' });
      console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);

      return DEV_SERVER_URL;
    } catch {
      console.log(
        "Vite dev server not running. Run 'bun run dev:hmr' for HMR support.",
      );
    }
  }

  return 'views://mainview/index.html';
}

// Create the window
const url = await getViewUrl();

new BrowserWindow({
  title: 'Dev Review',
  url,
  rpc,
  frame: {
    x: 200,
    y: 200,
    width: 1400,
    height: 900,
  },
});

// Watch the changes directory for manifest updates
try {
  watch(CHANGES_DIR, (_eventType, filename) => {
    if (!filename || filename.endsWith('.json')) {
      rpc.send.manifestsChanged({});
    }
  });
  console.log(`Watching ${CHANGES_DIR} for manifest changes`);
} catch {
  console.log('Changes directory not found, skipping watcher');
}

// Watch .git directory for index changes (commits, staging, etc.)
try {
  watch(GIT_DIR, (_eventType, filename) => {
    if (!filename || filename === 'index' || filename === 'HEAD') {
      rpc.send.manifestsChanged({});
    }
  });
  console.log(`Watching ${GIT_DIR} for git state changes`);
} catch {
  console.log('.git directory not found, skipping watcher');
}

// Watch the plans directory for plan file updates
try {
  watch(PLANS_DIR, (_eventType, filename) => {
    if (!filename || filename.endsWith('.md')) {
      rpc.send.plansChanged({});
    }
  });
  console.log(`Watching ${PLANS_DIR} for plan changes`);
} catch {
  console.log('Plans directory not found, skipping watcher');
}
