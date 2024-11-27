import { Utils } from '@minddrop/extension';
import { DefaultBoardProperties } from '../constants';
import { BoardContent, BoardDocument } from '../types';

export const PARENT_DIR_PATH = 'path/to';

export const textBlock1 = Utils.generateTextBlock('Text 1');
export const textBlock2 = Utils.generateTextBlock('Text 2');
export const textBlock3 = Utils.generateTextBlock('Text 3');

export const column1Block = Utils.generateBlock('board-column', {
  children: [textBlock1.id, textBlock2.id],
});
export const column2Block = Utils.generateBlock('board-column', {
  children: [textBlock3.id],
});
export const column3Block = Utils.generateBlock('board-column');
export const columnsBlock = Utils.generateBlock('board-columns', {
  children: [column1Block.id, column2Block.id, column3Block.id],
});

export const boardProperties = { ...DefaultBoardProperties };

export const boardContent: BoardContent = {
  blocks: [
    columnsBlock,
    column1Block,
    column2Block,
    column3Block,
    textBlock1,
    textBlock2,
    textBlock3,
  ],
  rootBlocks: [columnsBlock.id],
};

export const boardFileTextContent = JSON.stringify({
  properties: boardProperties,
  content: boardContent,
});

export const boardDocument: BoardDocument & { content: BoardContent } = {
  properties: boardProperties,
  fileType: 'board',
  wrapped: false,
  title: 'My board',
  path: `${PARENT_DIR_PATH}/My Board.board`,
  fileTextContent: boardFileTextContent,
  content: boardContent,
};

export const boardDocumentContentNull: BoardDocument = {
  ...boardDocument,
  content: null,
};
