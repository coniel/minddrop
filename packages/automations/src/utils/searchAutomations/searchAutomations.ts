import { fuzzySearch } from '@minddrop/utils';
import { AutomationsStore } from '../../AutomationsStore';
import { Automation } from '../../types';

/**
 * Performs a fuzzy search on automation names.
 *
 * @param searchText - The search text.
 * @returns The matched automations ranked by match quality.
 */
export function searchAutomations(searchText: string): Automation[] {
  const allAutomations = AutomationsStore.getAllArray();

  // Map each name to its automations. Names can collide so each
  // maps to a list.
  const automationsByName = new Map<string, Automation[]>();

  allAutomations.forEach((automation) => {
    const nameAutomations = automationsByName.get(automation.name) ?? [];

    nameAutomations.push(automation);
    automationsByName.set(automation.name, nameAutomations);
  });

  // Fuzzy match against the automation names
  const matchedNames = fuzzySearch(
    allAutomations.map((automation) => automation.name),
    searchText,
  );

  // Collect matched automations in rank order
  const matched: Automation[] = [];

  matchedNames.forEach((name) => {
    automationsByName.get(name)?.forEach((automation) => {
      // Skip automations already matched via a duplicate name
      if (!matched.includes(automation)) {
        matched.push(automation);
      }
    });
  });

  return matched;
}
