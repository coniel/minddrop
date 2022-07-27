import { ResourceReference } from '@minddrop/resources';

export interface SelectionItem extends ResourceReference {
  /**
   * A resource reference representing the parent resource
   * within which the selected resource was selected.
   */
  parent?: ResourceReference;
}
