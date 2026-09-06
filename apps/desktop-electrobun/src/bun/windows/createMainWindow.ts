import {
  BrowserWindow,
  Display,
  ElectrobunEvent,
  Screen,
  Utils,
} from 'electrobun/bun';
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

// The data Electrobun's move and resize events carry, which its
// handler signature types as unknown.
type WindowMoveData = { x: number; y: number };
type WindowResizeData = WindowMoveData & { width: number; height: number };

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
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(() => {
      Bun.write(WINDOW_STATE_FILE, JSON.stringify(state));
    }, 500);
  }

  mainWindow.on('move', (event) => {
    if (!isWindowEvent<WindowMoveData>(event, ['x', 'y'])) {
      return;
    }

    state.isFullScreen = mainWindow.isFullScreen();
    state.x = event.data.x;
    state.y = event.data.y;
    // Update which display the window is on
    const display = getDisplayForPosition(state.x, state.y);
    state.displayId = String(display.id);
    saveState();
  });

  mainWindow.on('resize', (event) => {
    if (
      !isWindowEvent<WindowResizeData>(event, ['x', 'y', 'width', 'height'])
    ) {
      return;
    }

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
 * Checks whether a window event carries the given numeric data keys,
 * narrowing it to the event type built on that data.
 */
function isWindowEvent<Data>(
  event: unknown,
  keys: (keyof Data)[],
): event is ElectrobunEvent<Data, unknown> {
  if (typeof event !== 'object' || event === null || !('data' in event)) {
    return false;
  }

  const { data } = event;

  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return keys.every((key) => typeof Reflect.get(data, key) === 'number');
}

/**
 * Reads the persisted window state, falling back to the default state
 * on the primary display.
 */
async function readWindowState(): Promise<WindowState> {
  try {
    const saved = parseWindowState(
      JSON.parse(await Bun.file(WINDOW_STATE_FILE).text()),
    );
    const targetDisplay = saved.displayId
      ? (findDisplayById(saved.displayId) ?? Screen.getPrimaryDisplay())
      : Screen.getPrimaryDisplay();

    return {
      ...DEFAULT_STATE,
      ...saved,
      ...resolveSavedPosition(saved, targetDisplay),
      displayId: String(targetDisplay.id),
    };
  } catch {
    // No saved state, use defaults on primary display
    const primary = Screen.getPrimaryDisplay();

    return { ...DEFAULT_STATE, displayId: String(primary.id) };
  }
}

/**
 * Picks the window state fields out of parsed JSON, dropping any which
 * are missing or of the wrong type.
 */
function parseWindowState(json: unknown): Partial<WindowState> {
  if (typeof json !== 'object' || json === null) {
    return {};
  }

  const state: Partial<WindowState> = {};
  const x: unknown = Reflect.get(json, 'x');
  const y: unknown = Reflect.get(json, 'y');
  const width: unknown = Reflect.get(json, 'width');
  const height: unknown = Reflect.get(json, 'height');
  const displayId: unknown = Reflect.get(json, 'displayId');
  const isFullScreen: unknown = Reflect.get(json, 'isFullScreen');

  if (typeof x === 'number') {
    state.x = x;
  }

  if (typeof y === 'number') {
    state.y = y;
  }

  if (typeof width === 'number') {
    state.width = width;
  }

  if (typeof height === 'number') {
    state.height = height;
  }

  if (typeof displayId === 'string') {
    state.displayId = displayId;
  }

  if (typeof isFullScreen === 'boolean') {
    state.isFullScreen = isFullScreen;
  }

  return state;
}

/**
 * Resolves the position to open the window at, keeping the saved one
 * while it still falls on the target display and otherwise placing the
 * window in the display's top-left area.
 */
function resolveSavedPosition(
  saved: Partial<WindowState>,
  display: Display,
): { x: number; y: number } {
  if (
    saved.x !== undefined &&
    saved.y !== undefined &&
    isPositionOnDisplay(display, saved.x, saved.y)
  ) {
    return { x: saved.x, y: saved.y };
  }

  return { x: display.bounds.x + 100, y: display.bounds.y + 100 };
}

function findDisplayById(id: string) {
  return Screen.getAllDisplays().find((d) => String(d.id) === id);
}

function isPositionOnDisplay(display: Display, x: number, y: number) {
  const { x: dx, y: dy, width: dw, height: dh } = display.bounds;

  return x >= dx && x < dx + dw && y >= dy && y < dy + dh;
}

function getDisplayForPosition(x: number, y: number) {
  return (
    Screen.getAllDisplays().find((d) => isPositionOnDisplay(d, x, y)) ??
    Screen.getPrimaryDisplay()
  );
}
