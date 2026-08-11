import { AutomationsStore } from '../AutomationsStore';
import { AutomationNotFoundError } from '../errors';
import { Automation } from '../types';

/**
 * Retrieves an automation from the store by ID.
 *
 * @param id - The ID of the automation.
 * @param throwOnNotFound - Whether to throw an error if the automation is not found.
 * @returns The automation object.
 *
 * @throws {AutomationNotFoundError} If the automation does not exist.
 */
export function getAutomation(id: string): Automation;
export function getAutomation(
  id: string,
  throwOnNotFound: false,
): Automation | null;
export function getAutomation(
  id: string,
  throwOnNotFound = true,
): Automation | null {
  // Get the automation from the store
  const automation = AutomationsStore.get(id);

  // Throw an error if it doesn't exist, unless specified not to
  if (!automation && throwOnNotFound) {
    throw new AutomationNotFoundError(id);
  } else if (!automation && !throwOnNotFound) {
    return null;
  }

  return automation;
}
