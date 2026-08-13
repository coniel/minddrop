import type { BrowserWindow } from 'electrobun/bun';

// The window whose fill state is toggled
let targetWindow: BrowserWindow | null = null;

// Called when the onboarding window reports that a workspace is ready
let onboardingCompleteHandler: (() => void) | null = null;

export function setWindowRpcTarget(window: BrowserWindow): void {
  targetWindow = window;
}

export function setOnboardingCompleteHandler(handler: () => void): void {
  onboardingCompleteHandler = handler;
}

export const windowRpcHandlers = {
  windowToggleFill: () => {
    if (!targetWindow) {
      return;
    }

    // Delegate to the native zoom, which computes the fill frame correctly
    // for whichever display the window is on, remembers the previous frame
    // to restore on toggle, and treats a manual move/resize as a new baseline
    if (targetWindow.isMaximized()) {
      targetWindow.unmaximize();
    } else {
      targetWindow.maximize();
    }
  },

  onboardingComplete: () => {
    onboardingCompleteHandler?.();
  },
};
