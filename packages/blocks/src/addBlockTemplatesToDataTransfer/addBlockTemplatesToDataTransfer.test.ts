import { afterEach, describe, expect, it } from 'vitest';
import { createDataTransfer } from '@minddrop/test-utils';
import { blockTemplate1, blockTemplate2 } from '../test-utils';
import { addBlockTemplatesToDataTransfer } from './addBlockTemplatesToDataTransfer';

describe('addBlockTemplatesToDataTransfer', () => {
  let dataTransfer = createDataTransfer({});

  afterEach(() => {
    dataTransfer = createDataTransfer({});
  });

  it('adds block templates to the data dataTransfer', () => {
    addBlockTemplatesToDataTransfer(dataTransfer, [blockTemplate1]);

    expect(
      dataTransfer.getData('application/minddrop-block-templates'),
    ).toEqual(JSON.stringify([blockTemplate1]));
  });

  it('preserves existing block templates in the data dataTransfer', () => {
    dataTransfer.setData(
      'application/minddrop-block-templates',
      JSON.stringify([blockTemplate1]),
    );

    addBlockTemplatesToDataTransfer(dataTransfer, [blockTemplate2]);

    expect(
      dataTransfer.getData('application/minddrop-block-templates'),
    ).toEqual(JSON.stringify([blockTemplate1, blockTemplate2]));
  });
});
