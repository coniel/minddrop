import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignElementConfigs } from '@minddrop/designs-next';
import { PdfElementConfig, PdfElementType } from '../elements';
import { cleanup, setup } from '../test-utils';
import { initializePdfFeature } from './initializePdfFeature';

describe('initializePdfFeature', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('registers the PDF element config', () => {
    initializePdfFeature();

    expect(DesignElementConfigs.get(PdfElementType)).toBe(PdfElementConfig);
  });
});
