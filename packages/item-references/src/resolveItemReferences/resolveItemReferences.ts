import { matchItemReference } from '../matchItemReference';

export interface ResolveItemReferencesOptions {
  /**
   * Keep references that match an adapter but whose item does not
   * exist yet, passing the reference through in place of an ID.
   * When false, such references are dropped.
   */
  keepMissing?: boolean;

  /**
   * The workspace to resolve the references in. Omit for the active
   * workspace.
   */
  workspaceId?: string;
}

/**
 * Resolves durable item references back into runtime item IDs using
 * the registered adapters, preserving input order. References
 * nothing recognizes are dropped.
 *
 * @param references - The durable item references to resolve.
 * @param options - Resolution options.
 * @returns The runtime item IDs.
 */
export function resolveItemReferences(
  references: string[],
  options: ResolveItemReferencesOptions = {},
): string[] {
  return references.flatMap((reference) => {
    // Match the reference against the registered adapters
    const match = matchItemReference(reference, options.workspaceId);

    // Drop references nothing recognizes
    if (!match) {
      return [];
    }

    // Matched items contribute their runtime ID
    if (match.id !== null) {
      return [match.id];
    }

    // Keep or drop valid references to not-yet-existing items
    return options.keepMissing ? [reference] : [];
  });
}
