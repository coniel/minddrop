import { describe, it, expect } from 'vitest';
import { getBoardContent } from './getBoardContent';
import { BoardDocumentTypeConfig } from '../BoardDocumentTypeConfig';
import { Documents } from '@minddrop/documents';
import {
  boardDocument,
  boardContent,
  boardDocumentContentNull,
} from '../test-utils';

describe('getBoardContent', () => {
  it('returns the board content if not null', () => {
    expect(getBoardContent(boardDocument)).toEqual(boardContent);
  });

  it('parses the board content from the document if content is null', () => {
    expect(getBoardContent(boardDocumentContentNull)).toEqual(boardContent);
  });
});
