import { Ast } from '@minddrop/ast';
import { EntryReference, SqlEntryPropertyRecord } from '../../types';

/**
 * Resolves the references an entry's property values contain: one for
 * each collection value, and one for each wikilink in its content, in
 * document order. A link written several times has a reference for each.
 *
 * @param entryId - The ID of the entry.
 * @param properties - The entry's property values.
 * @returns The entry's references.
 */
export function resolveEntryPropertyReferences(
  entryId: string,
  properties: SqlEntryPropertyRecord[],
): EntryReference[] {
  // The resolved references
  const references: EntryReference[] = [];

  for (const property of properties) {
    // Resolve a reference for each collection value
    if (property.type === 'collection' && Array.isArray(property.value)) {
      for (const targetEntryId of property.value) {
        references.push({
          kind: 'property',
          entryId,
          propertyName: property.name,
          targetEntryId,
        });
      }
    }

    // Resolve a reference for each wikilink in the content
    if (property.type === 'content' && typeof property.value === 'string') {
      for (const { reference, fragment } of Ast.wikilinksFromMarkdown(
        property.value,
      )) {
        references.push({ kind: 'wikilink', entryId, reference, fragment });
      }
    }
  }

  return references;
}
