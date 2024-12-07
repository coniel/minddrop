import { BLOCK_TEMPLATES_DATA_KEY } from '../constants';
import { BlockTemplate } from '../types';

/**
 * Adds block templates to a DataTransfer object.
 *
 * @param dataTransfer  - The DataTransfer object to add the block templates to.
 * @param blocks - The block templates to add.
 */
export function addBlockTemplatesToDataTransfer(
  dataTransfer: DataTransfer | null,
  templates: BlockTemplate[],
): void {
  let existingTemplates = [];

  if (!dataTransfer) {
    return;
  }

  // If there are already block templates in the data transfer,
  // parse them so we can append the new templates.
  if (dataTransfer.getData(BLOCK_TEMPLATES_DATA_KEY)) {
    existingTemplates = JSON.parse(
      dataTransfer.getData(BLOCK_TEMPLATES_DATA_KEY),
    );
  }

  // Append the new templates to the existing ones
  dataTransfer.setData(
    BLOCK_TEMPLATES_DATA_KEY,
    JSON.stringify(existingTemplates.concat(templates)),
  );
}
