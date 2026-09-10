export type InputModality = 'pointer' | 'keyboard';

// The kind of input the person last used, which tells a focus they
// moved themselves from one the app moved for them.
let modality: InputModality = 'pointer';

// Capture so the modality is recorded before any handler which
// reads it, whatever stops the event on its way up. Only the
// person's own events count: components synthesize key presses to
// drive each other (a searchable menu closes itself with an Escape
// it dispatches), and those say nothing about what they are using.
if (typeof document !== 'undefined') {
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.isTrusted) {
        modality = 'keyboard';
      }
    },
    true,
  );
  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.isTrusted) {
        modality = 'pointer';
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
