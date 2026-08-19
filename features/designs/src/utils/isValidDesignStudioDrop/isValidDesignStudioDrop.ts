import { DropEventData } from '@minddrop/selection';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
  DesignRolesDataKey,
} from '../../constants';
import { DesignStudioDropEventData } from '../../types';

/**
 * Checks if a drop event contains valid design studio data.
 *
 * @param dropEvent - The drop event to check.
 * @returns True if the drop event is valid, false otherwise.
 */
export function isValidDesignStudioDrop(
  dropEvent: DropEventData,
): dropEvent is DropEventData<DesignStudioDropEventData> {
  if (typeof dropEvent.data !== 'object' || dropEvent.data === null) {
    return false;
  }

  // Drop event contains design element templates
  if (DesignElementTemplatesDataKey in dropEvent.data) {
    return true;
  }

  // Drop event contains design elements
  if (DesignElementsDataKey in dropEvent.data) {
    return true;
  }

  // Drop event contains design roles
  if (DesignRolesDataKey in dropEvent.data) {
    return true;
  }

  return false;
}
