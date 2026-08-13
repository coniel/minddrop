import { BrowserWindow, Screen, Utils } from 'electrobun/bun';
import { createWebviewRPC } from '../bun-rpc';
import { setWindowRpcTarget } from '../windowRpc';
import { resolveViewUrl } from './resolveViewUrl';

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
const WINDOW_STATE_FILE = `${Utils.paths.config}/MindDrop/window-state.json`;

/**
 * Creates the main application window, restoring its previous size and
 * position, and persisting them as they change.
 */
export async function createMainWindow(): Promise<BrowserWindow> {
  const state = await readWindowState();
  const url = await resolveViewUrl('index.html');

  const mainWindow = new BrowserWindow({
    title: 'MindDrop',
    url,
    rpc: createWebviewRPC(),
    frame: {
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
    },
    trafficLightOffset: {
      x: 15,
      y: 11,
    },
    titleBarStyle: 'hiddenInset',
    styleMask: {
      Borderless: true,
      Titled: false,
    },
  });

  // trafficLightOffset.y is ignored when using titleBarStyle: 'hiddenInset'
  // so we need to set the position manually to fix the offset.
  mainWindow.setWindowButtonPosition(15, 11);

  mainWindow.setFullScreen(state.isFullScreen);

  // Allow window RPC handlers to control the main window
  setWindowRpcTarget(mainWindow);

  // Quit the app when the main window is closed
  mainWindow.on('close', () => {
    Utils.quit();
  });

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

  return mainWindow;
}

/**
 * Reads the persisted window state, falling back to the default state
 * on the primary display.
 */
async function readWindowState(): Promise<WindowState> {
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

    return {
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

    return { ...DEFAULT_STATE, displayId: String(primary.id) };
  }
}

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
