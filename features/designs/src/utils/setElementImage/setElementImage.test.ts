import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignStudioStore, getDesignElement } from '../../DesignStudioStore';
import { cleanup, element_0, setup } from '../../test-utils';
import { setElementImage } from './setElementImage';

const IMAGE_FILE = 'placeholder.png';

describe('setElementImage', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the bound design property placeholder on bound elements', async () => {
    // Bind the element to the 'Title' design property
    DesignStudioStore.getState().updateElement(element_0.id, {
      property: 'Title',
    });

    await setElementImage(element_0.id, IMAGE_FILE);

    const property = DesignStudioStore.getState().design?.properties.find(
      (candidate) => candidate.name === 'Title',
    );

    // The property placeholder is set, the element is untouched
    expect(property?.placeholder).toBe(IMAGE_FILE);
    expect(getDesignElement(element_0.id)).not.toHaveProperty('content');
  });

  it('sets the content image on static elements', async () => {
    DesignStudioStore.getState().updateElement(element_0.id, { static: true });

    await setElementImage(element_0.id, IMAGE_FILE);

    expect(getDesignElement(element_0.id)).toMatchObject({
      content: IMAGE_FILE,
      static: true,
    });
  });

  it('switches unbound elements to static mode and sets the content image', async () => {
    await setElementImage(element_0.id, IMAGE_FILE);

    expect(getDesignElement(element_0.id)).toMatchObject({
      content: IMAGE_FILE,
      static: true,
    });
  });

  it('does nothing when the element does not exist', async () => {
    await expect(
      setElementImage('missing', IMAGE_FILE),
    ).resolves.toBeUndefined();
  });
});
