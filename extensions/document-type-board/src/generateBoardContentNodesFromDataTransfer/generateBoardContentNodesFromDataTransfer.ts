import { Documents } from '@minddrop/documents';
import { Fs } from '@minddrop/file-system';
import { Nodes, Node } from '@minddrop/nodes';

/**
 * Generates nodes from a data transfer object.
 * If the data transfer contains files and the board is not wrapped,
 * the board document will be wrapped before generating the nodes.
 *
 * @param boardPath - The path of the board document.
 * @param dataTransfer - The data transfer object.
 * @returns A tuple containing the generated nodes and the path of the board document.
 */
export async function generateBoardContentNodesFromDataTransfer(
  boardPath: string,
  dataTransfer: DataTransfer,
): Promise<[Node[], string]> {
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

  console.log('transfer', transfer);
  // Generate new nodes from the data transfer
  const nodes = await Nodes.fromDataTransfer(transfer, parentPath);

  console.log('nodes', nodes);

  return [nodes, path];
}
