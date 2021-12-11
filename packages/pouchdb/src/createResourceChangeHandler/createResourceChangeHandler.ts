import { Core } from '@minddrop/core';
import { ResourceDocument } from '../types';

export function createResourceChangeHandler(
  core: Core,
): (
  resourceType: string,
  document: ResourceDocument,
  deleted: boolean,
) => void {
  return (
    resourceType: string,
    document: ResourceDocument,
    deleted: boolean,
  ) => {
    const connector = core
      .getResourceConnectors()
      .find((c) => c.type === resourceType);

    if (connector && connector.onChange) {
      connector.onChange(document, deleted);
    }
  };
}
