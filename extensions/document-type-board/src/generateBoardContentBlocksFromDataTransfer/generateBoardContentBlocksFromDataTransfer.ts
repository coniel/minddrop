import { MindDropApi, Block } from '@minddrop/extension';

/**
 * Generates blocks from a data transfer object.
 * If the data transfer contains files and the board is not wrapped,
 * the board document will be wrapped before generating the blocks.
 *
 * @param api - The MindDrop API.
 * @param boardPath - The path of the board document.
 * @param dataTransfer - The data transfer object.
 * @returns A tuple containing the generated blocks and the path of the board document.
 */
export async function generateBoardContentBlocksFromDataTransfer(
  API: MindDropApi,
  boardPath: string,
  dataTransfer: DataTransfer,
): Promise<[Block[], string]> {
  const { Documents, Fs, Blocks } = API;
  let path = boardPath;
  const transfer = {
    files: dataTransfer.files,
    types: dataTransfer.types,
    data: dataTransfer.types.reduce(
      (acc, type) => ({ ...acc, [type]: dataTransfer.getData(type) }),
      {},
    ),
    // @ts-ignore
    getData: (key: string) => transfer.data[key],
  } as unknown as DataTransfer;

  // If the data transfer contains files and the board is not wrapped,
  // we first need to wrap the board document.
  if (dataTransfer.files?.length > 0 && !Documents.isWrapped(boardPath)) {
    path = await Documents.wrap(boardPath);
  }

  // Get the path of the board's wrapper directory
  const parentPath = Fs.parentDirPath(path);

  // Generate new blocks from the data transfer
  const blocks = await Blocks.fromDataTransfer(transfer, parentPath);

  return [blocks, path];
}
