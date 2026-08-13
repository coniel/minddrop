import { BrowserWindow, Screen } from 'electrobun/bun';
import { createWebviewRPC } from '../bun-rpc';
import { resolveViewUrl } from './resolveViewUrl';

const WIDTH = 720;
const HEIGHT = 560;

/**
 * Creates the onboarding window, shown in place of the main window
 * while the app has no workspace.
 */
export async function createOnboardingWindow(): Promise<BrowserWindow> {
  const url = await resolveViewUrl('onboarding.html');
  const display = Screen.getPrimaryDisplay();

  const onboardingWindow = new BrowserWindow({
    title: 'MindDrop',
    url,
    rpc: createWebviewRPC(),
    // Center the window on the primary display
    frame: {
      x: display.bounds.x + (display.bounds.width - WIDTH) / 2,
      y: display.bounds.y + (display.bounds.height - HEIGHT) / 2,
      width: WIDTH,
      height: HEIGHT,
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
  onboardingWindow.setWindowButtonPosition(15, 11);

  return onboardingWindow;
}
