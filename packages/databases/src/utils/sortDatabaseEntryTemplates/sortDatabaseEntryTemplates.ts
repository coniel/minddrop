import { orderByCreated, reconcileIdOrder } from '@minddrop/utils';
import { DatabaseEntryTemplate } from '../../types';

/**
 * Sorts a database's entry templates by the config's template ID
 * list. Templates missing from the list (or all of them when there
 * is no list) are sorted by creation date, oldest first, after the
 * ordered ones.
 *
 * @param templates - The entry templates to sort.
 * @param order - The config's ordered template ID list.
 * @returns The sorted entry templates.
 */
export function sortDatabaseEntryTemplates(
  templates: DatabaseEntryTemplate[],
  order: string[] = [],
): DatabaseEntryTemplate[] {
  return reconcileIdOrder(order, templates, orderByCreated);
}
