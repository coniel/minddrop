import { BrowserWindow, Screen, Updater, Utils } from 'electrobun/bun';
import { myWebviewRPC } from './bun-rpc';
import './server';

type WindowState = {
  x: number;
  y: number;
  width: number;
  height: number;
  displayId: string;
  isFullScreen: boolean;
};

const DEFAULT_STATE: WindowState = {
  x: 100,
  y: 100,
  width: 1200,
  height: 800,
  displayId: '',
  isFullScreen: false,
};
const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;
const WINDOW_STATE_FILE = `${Utils.paths.config}/MindDrop/window-state.json`;

function findDisplayById(id: string) {
  return Screen.getAllDisplays().find((d) => String(d.id) === id);
}

function isPositionOnDisplay(
  display: ReturnType<typeof Screen.getPrimaryDisplay>,
  x: number,
  y: number,
) {
  const { x: dx, y: dy, width: dw, height: dh } = display.bounds;

  return x >= dx && x < dx + dw && y >= dy && y < dy + dh;
}

function getDisplayForPosition(x: number, y: number) {
  return (
    Screen.getAllDisplays().find((d) => isPositionOnDisplay(d, x, y)) ??
    Screen.getPrimaryDisplay()
  );
}

let state: WindowState = { ...DEFAULT_STATE };

try {
  const saved = JSON.parse(
    await Bun.file(WINDOW_STATE_FILE).text(),
  ) as Partial<WindowState>;
  const targetDisplay = saved.displayId
    ? (findDisplayById(saved.displayId) ?? Screen.getPrimaryDisplay())
    : Screen.getPrimaryDisplay();

  // Validate saved position is still on a connected display
  const positionValid =
    saved.x !== undefined &&
    saved.y !== undefined &&
    isPositionOnDisplay(targetDisplay, saved.x, saved.y);

  state = {
    ...DEFAULT_STATE,
    ...saved,
    // If position is off-screen, place in top-left area of the target display
    x: positionValid ? saved.x! : targetDisplay.bounds.x + 100,
    y: positionValid ? saved.y! : targetDisplay.bounds.y + 100,
    displayId: String(targetDisplay.id),
  };
} catch {
  // No saved state, use defaults on primary display
  const primary = Screen.getPrimaryDisplay();
  state.displayId = String(primary.id);
}

// --- Create window ---

// Check if Vite dev server is running for HMR
async function getMainViewUrl(): Promise<string> {
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

// Create the main application window
const url = await getMainViewUrl();

const mainWindow = new BrowserWindow({
  title: 'MindDrop',
  url,
  rpc: myWebviewRPC,
  frame: {
    x: state.x,
    y: state.y,
    width: state.width,
    height: state.height,
  },
  titleBarStyle: 'hiddenInset',
  styleMask: {
    Borderless: true,
    Titled: false,
  },
});

mainWindow.setFullScreen(state.isFullScreen);

// Quit the app when the main window is closed
mainWindow.on('close', () => {
  Utils.quit();
});

// --- Persist state ---

let saveTimeout: Timer | null = null;

function saveState() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    Bun.write(WINDOW_STATE_FILE, JSON.stringify(state));
  }, 500);
}

mainWindow.on('move', (event: any) => {
  state.isFullScreen = mainWindow.isFullScreen();
  state.x = event.data.x;
  state.y = event.data.y;
  // Update which display the window is on
  const display = getDisplayForPosition(state.x, state.y);
  state.displayId = String(display.id);
  saveState();
});

mainWindow.on('resize', (event: any) => {
  state.isFullScreen = mainWindow.isFullScreen();
  state.width = event.data.width;
  state.height = event.data.height;
  state.x = event.data.x; // resize from top-left corner also moves
  state.y = event.data.y;
  const display = getDisplayForPosition(state.x, state.y);
  state.displayId = String(display.id);
  saveState();
});
