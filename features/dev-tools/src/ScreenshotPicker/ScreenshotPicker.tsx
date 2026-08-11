import React, { useEffect, useRef, useState } from 'react';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { TextInput, propsToClass } from '@minddrop/ui-primitives';
import { Theme } from '@minddrop/ui-theme';
import { slugify } from '@minddrop/utils';
import { getScreenshotAdapter } from '../screenshotAdapter';
import './ScreenshotPicker.css';

// Cmd+Ctrl+4 toggles picker mode
const SHORTCUT_CODE = 'Digit4';

// Hovered elements snap to their enclosing panel view when they have one
const TARGET_SELECTOR = '.panel-view';

// Time given to the app to paint the hidden overlay and the new
// theme appearance before capturing
const PAINT_DELAY_MS = 330;

// Each element is captured once per appearance
const CAPTURED_APPEARANCES = ['light', 'dark'] as const;

// Time the capture result is shown for before the picker closes
const RESULT_DELAY_MS = 1600;

// Time a capture failure is shown for before the picker closes
const ERROR_DELAY_MS = 6000;

// Used when the capture is submitted without a usable name
const UNNAMED_CAPTURE_NAME = 'screenshot';

const screenshotsI18nKey = createI18nKeyBuilder('devTools.screenshots.');

type PickerMode = 'idle' | 'picking' | 'naming' | 'capturing' | 'result';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Renders the screenshot picker overlay, which captures a light and
 * dark image of a single element.
 *
 * Press Cmd+Ctrl+4 to enter picker mode, click an element to pick it,
 * name the capture, or press Escape to exit.
 *
 * Renders nothing on platforms without a registered screenshot
 * adapter.
 */
export const ScreenshotPicker: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  const [mode, setMode] = useState<PickerMode>('idle');
  const [outline, setOutline] = useState<Rect | null>(null);
  const [name, setName] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const { t } = useTranslation();

  // Bind the shortcut which opens and closes the picker
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Toggle picker mode, which is unavailable without an adapter
      if (
        event.metaKey &&
        event.ctrlKey &&
        event.code === SHORTCUT_CODE &&
        getScreenshotAdapter()
      ) {
        event.preventDefault();
        setMode((current) => (current === 'idle' ? 'picking' : 'idle'));

        return;
      }

      // Exit picker mode
      if (event.key === 'Escape') {
        setMode('idle');
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Reset the picker's state each time it opens, and drop the caret
  // out of any focused editor so that it is not captured
  useEffect(() => {
    if (mode !== 'picking') {
      return;
    }

    setOutline(null);
    setResult(null);
    setFailed(false);
    targetRef.current = null;
    originRef.current = null;

    if (
      document.activeElement instanceof HTMLElement &&
      isEditableElement(document.activeElement)
    ) {
      document.activeElement.blur();
    }
  }, [mode]);

  // Focus the name input as soon as an element has been picked
  useEffect(() => {
    if (mode === 'naming') {
      inputRef.current?.focus();
    }
  }, [mode]);

  // Close the picker once its result has been shown
  useEffect(() => {
    if (mode !== 'result') {
      return;
    }

    const timeout = setTimeout(
      () => setMode('idle'),
      failed ? ERROR_DELAY_MS : RESULT_DELAY_MS,
    );

    return () => {
      clearTimeout(timeout);
    };
  }, [mode, failed]);

  // Track the element under the cursor and move the outline onto it
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (mode !== 'picking') {
      return;
    }

    const target = resolveTarget(event.clientX, event.clientY);

    targetRef.current = target;

    // Hide the outline while the cursor is over nothing capturable
    if (!target) {
      setOutline(null);

      return;
    }

    const rect = target.getBoundingClientRect();

    setOutline({
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
  }

  // Pick the outlined element and ask for the capture's name
  async function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    const target = targetRef.current;
    const adapter = getScreenshotAdapter();

    if (mode !== 'picking' || !target || !adapter) {
      return;
    }

    // Resolve where the viewport sits on screen from the cursor's
    // position, which has to happen before the cursor can move
    originRef.current = await adapter.getViewportScreenOrigin(
      event.clientX,
      event.clientY,
    );

    setName('');
    setMode('naming');
  }

  // Start the capture, or cancel it
  function handleNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      capture();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setMode('idle');
    }
  }

  // Keep clicks in the prompt from reaching the overlay
  function handlePromptClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  async function capture() {
    const target = targetRef.current;
    const origin = originRef.current;
    const adapter = getScreenshotAdapter();

    if (!target || !origin || !adapter) {
      return;
    }

    // Names made up entirely of unsupported characters slugify to nothing
    const slug = slugify(name) || UNNAMED_CAPTURE_NAME;

    const fileName = `${slug}-${getFileTimestamp()}`;

    // Restored once both appearances have been captured
    const originalVariant = Theme.getVariant();

    setMode('capturing');

    try {
      for (const appearance of CAPTURED_APPEARANCES) {
        Theme.setVariant(appearance);

        // Wait for the hidden overlay and the new appearance to be painted
        await wait(PAINT_DELAY_MS);

        // Measured per appearance in case the theme affects layout
        const rect = target.getBoundingClientRect();

        await adapter.captureScreenRegion({
          x: origin.x + rect.left,
          y: origin.y + rect.top,
          width: rect.width,
          height: rect.height,
          fileName: `${fileName}-${appearance}`,
        });
      }

      setResult(fileName);
      setFailed(false);
    } catch (error) {
      setResult(error instanceof Error ? error.message : String(error));
      setFailed(true);
    }

    // Put the theme back the way it was found
    Theme.setVariant(originalVariant);
    setMode('result');
  }

  if (mode === 'idle') {
    return null;
  }

  return (
    <div
      className={propsToClass('screenshot-picker', {
        capturing: mode === 'capturing',
      })}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {/* Highlights the element which will be captured */}
      {outline && mode === 'picking' && (
        <div
          className="screenshot-picker-outline"
          style={{
            left: outline.left,
            top: outline.top,
            width: outline.width,
            height: outline.height,
          }}
        />
      )}

      <div className="screenshot-picker-panel">
        {/* Asks for the name the capture is written under */}
        {mode === 'naming' && (
          <div className="screenshot-picker-prompt" onClick={handlePromptClick}>
            <TextInput
              ref={inputRef}
              size="lg"
              value={name}
              placeholder={screenshotsI18nKey('namePlaceholder')}
              unassisted
              onValueChange={setName}
              onKeyDown={handleNameKeyDown}
            />
          </div>
        )}

        <div
          className={propsToClass('screenshot-picker-hint', { error: failed })}
        >
          {result ?? t(getHintKey(mode))}
        </div>
      </div>
    </div>
  );
};

/**
 * Returns the element to capture at the given viewport coordinates,
 * preferring the enclosing panel view over the hovered element.
 *
 * @param clientX - Horizontal viewport coordinate.
 * @param clientY - Vertical viewport coordinate.
 * @returns The element to capture, or null if there is none.
 */
function resolveTarget(clientX: number, clientY: number): HTMLElement | null {
  // Hit test past the overlay, which sits above the entire app
  const element = document
    .elementsFromPoint(clientX, clientY)
    .find((candidate) => !candidate.closest('.screenshot-picker'));

  if (!(element instanceof HTMLElement)) {
    return null;
  }

  return element.closest<HTMLElement>(TARGET_SELECTOR) ?? element;
}

/**
 * Returns the translation key of the hint shown for a mode.
 */
function getHintKey(mode: PickerMode) {
  if (mode === 'naming') {
    return screenshotsI18nKey('nameHint');
  }

  return screenshotsI18nKey('pickHint');
}

/**
 * Generates a file name safe timestamp of the current local time
 * in the format YYYYMMDD-HHmmss.
 */
function getFileTimestamp(): string {
  const now = new Date();

  const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map(padTimeValue)
    .join('');

  const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(padTimeValue)
    .join('');

  return `${date}-${time}`;
}

/**
 * Pads a date or time value to two digits.
 */
function padTimeValue(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Checks whether an element accepts text input.
 */
function isEditableElement(element: HTMLElement): boolean {
  return (
    element.isContentEditable ||
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  );
}

/**
 * Resolves after the given duration.
 */
function wait(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
