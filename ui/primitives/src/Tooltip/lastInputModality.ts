export type InputModality = 'pointer' | 'keyboard';

// The keys a user moves the focus with themselves. Any other key
// which ends up moving it was followed by a move the app made: a
// popup closing on Enter or Escape hands the focus back to the
// control which opened it.
const FocusMovingKeys = [
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
];

// The kind of input the user last used, which tells a focus they
// moved themselves from one the app moved for them.
let modality: InputModality = 'pointer';

// Whether that input was one which moves the focus on its own.
let movedFocus = false;

// Capture so the modality is recorded before any handler which
// reads it, whatever stops the event on its way up. Only the
// user's own events count: components synthesize key presses to
// drive each other (a searchable menu closes itself with an Escape
// it dispatches), and those say nothing about what they are using.
if (typeof document !== 'undefined') {
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.isTrusted) {
        modality = 'keyboard';
        movedFocus = FocusMovingKeys.includes(event.key);
      }
    },
    true,
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.isTrusted) {
        modality = 'pointer';
        movedFocus = false;
      }
    },
    true,
  );
}

/**
 * Returns the input modality of the most recent interaction.
 *
 * @returns The last input modality.
 */
export function getLastInputModality(): InputModality {
  return modality;
}

/**
 * Returns whether the user's most recent interaction was one
 * which moves the focus itself, such as a tab or an arrow key. A
 * focus arriving after anything else is one the app moved on their
 * behalf.
 *
 * @returns Whether the last interaction moved the focus.
 */
export function lastInputMovedFocus(): boolean {
  return movedFocus;
}
