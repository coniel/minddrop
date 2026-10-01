import { AddContentDataKey } from '@minddrop/ui-databases';
import { TransferData } from '@minddrop/utils';

/**
 * Checks whether transfer data contains an add content card.
 *
 * @param data - The transfer data.
 * @returns Whether the data contains an add content card.
 */
export function hasTransferredAddContentCard(
  data: TransferData<{ [AddContentDataKey]?: unknown }>,
): boolean {
  return Boolean(data[AddContentDataKey]);
}
