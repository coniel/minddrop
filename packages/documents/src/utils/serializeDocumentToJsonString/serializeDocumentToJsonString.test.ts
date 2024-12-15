import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Blocks } from '@minddrop/blocks';
import { DocumentViewsStore } from '../../DocumentViewsStore';
import { DocumentsStore } from '../../DocumentsStore';
import { DocumentNotFoundError } from '../../errors';
import {
  cleanup,
  document1,
  document1Blocks,
  document1Views,
  setup,
} from '../../test-utils';
import { serializeDocumentToJsonString } from './serializeDocumentToJsonString';

describe('serializeDocumentToJsonString', () => {
  beforeEach(() => {
    setup();

    DocumentsStore.getState().load([document1]);
    DocumentViewsStore.getState().load(document1Views);
    Blocks.load(document1Blocks);
  });

  afterEach(() => {
    cleanup();

    Blocks.clear();
  });

  it('throws if the document does not exist', () => {
    expect(() => serializeDocumentToJsonString('missing')).toThrow(
      DocumentNotFoundError,
    );
  });

  it('removes derived fields from the document', () => {
    const resultString = serializeDocumentToJsonString(document1.id);
    const result = JSON.parse(resultString);

    expect(result.path).not.toBeDefined();
    expect(result.wrapped).not.toBeDefined();
  });

  it('replaces block ids with block data', () => {
    const resultString = serializeDocumentToJsonString(document1.id);
    const result = JSON.parse(resultString);
    const block1Parsed = JSON.parse(JSON.stringify(document1Blocks[0]));
    const block2Parsed = JSON.parse(JSON.stringify(document1Blocks[1]));

    expect(result.blocks).toEqual([block1Parsed, block2Parsed]);
  });

  it('replaces view ids with view data', () => {
    const resultString = serializeDocumentToJsonString(document1.id);
    const result = JSON.parse(resultString);

    expect(result.views).toEqual(document1Views);
  });
});
