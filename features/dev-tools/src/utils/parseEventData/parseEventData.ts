// Typographic quotes substituted for straight ones by operating
// system text replacement, which JSON does not accept
const TypographicQuotes = /[‘’“”]/g;

export interface ParsedEventData {
  /**
   * Whether the text could be parsed.
   */
  valid: boolean;

  /**
   * The parsed data, undefined when the text is empty or invalid.
   */
  data: unknown;
}

/**
 * Parses the JSON data an event is to be dispatched with.
 *
 * Text which does not parse is retried with typographic quotes
 * replaced by straight ones, so that substituted quotes do not
 * make otherwise valid data unusable.
 *
 * @param text - The JSON text to parse.
 * @returns The parsed data and whether the text could be parsed.
 */
export function parseEventData(text: string): ParsedEventData {
  const trimmed = text.trim();

  // Events can be dispatched without data
  if (!trimmed) {
    return { valid: true, data: undefined };
  }

  const parsed = parseJson(trimmed);

  if (parsed.valid) {
    return parsed;
  }

  return parseJson(trimmed.replace(TypographicQuotes, '"'));
}

/**
 * Parses JSON text, reporting whether it could be parsed rather
 * than throwing.
 */
function parseJson(text: string): ParsedEventData {
  try {
    return { valid: true, data: JSON.parse(text) };
  } catch {
    return { valid: false, data: undefined };
  }
}
