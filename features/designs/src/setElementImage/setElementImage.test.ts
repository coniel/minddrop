import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import {
  DesignStudioStore,
  createDesignStudioStore,
} from '../DesignStudioStore';
import { cleanup, setup } from '../test-utils';
import { setElementImage } from './setElementImage';

const {
  design_books,
  designProperties,
  layout_card_1,
  element_container_1,
  element_text_1,
  element_text_2,
} = DesignFixtures;

// The image file name written into the owner's media directory
const IMAGE_FILE = 'placeholder.png';

// A layout whose root holds a leaf, a container, and a second leaf
const testLayout = {
  ...layout_card_1,
  tree: {
    ...layout_card_1.tree,
    children: [element_text_1, element_container_1, element_text_2],
  },
};

const testDesign = { ...design_books, layouts: [testLayout] };

describe('setElementImage', () => {
  let studio: DesignStudioStore;

  beforeEach(() => {
    setup();

    // Each test gets its own store instance holding the test design
    studio = createDesignStudioStore();
    studio.initialize(testDesign, designProperties);
    studio.setActiveLayout(testLayout.id);
  });

  afterEach(cleanup);

  it('sets the bound design property placeholder on bound elements', async () => {
    // Bind the element to the 'Cover' design property
    studio.updateElement(element_text_1.id, { property: 'Cover' });

    await setElementImage(studio, element_text_1.id, IMAGE_FILE);

    const property = studio.getDesignProperty('Cover');

    // The property placeholder is set, the element is untouched
    expect(property?.placeholder).toBe(IMAGE_FILE);
    expect(studio.getDesignElement(element_text_1.id)).not.toHaveProperty(
      'content',
    );
  });

  it('sets the content image on static elements', async () => {
    studio.updateElement(element_text_1.id, { static: true });

    await setElementImage(studio, element_text_1.id, IMAGE_FILE);

    expect(studio.getDesignElement(element_text_1.id)).toMatchObject({
      content: IMAGE_FILE,
      static: true,
    });
  });

  it('sets the content image on static elements bound to a property', async () => {
    // Static elements display their own image, even when a
    // property binding lingers on the element
    studio.updateElement(element_text_1.id, {
      static: true,
      property: 'Cover',
    });

    await setElementImage(studio, element_text_1.id, IMAGE_FILE);

    // The element holds the image, the property is untouched
    expect(studio.getDesignElement(element_text_1.id)).toMatchObject({
      content: IMAGE_FILE,
      static: true,
    });
    expect(studio.getDesignProperty('Cover')?.placeholder).toBeUndefined();
  });

  it('switches unbound elements to static mode and sets the content image', async () => {
    await setElementImage(studio, element_text_1.id, IMAGE_FILE);

    expect(studio.getDesignElement(element_text_1.id)).toMatchObject({
      content: IMAGE_FILE,
      static: true,
    });
  });

  it('sets the content image when the bound property does not exist', async () => {
    // Bind the element to a property missing from the schema
    studio.updateElement(element_text_1.id, { property: 'Missing' });

    await setElementImage(studio, element_text_1.id, IMAGE_FILE);

    expect(studio.getDesignElement(element_text_1.id)).toMatchObject({
      content: IMAGE_FILE,
      static: true,
    });
  });

  it('does nothing when the element does not exist', async () => {
    await expect(
      setElementImage(studio, 'missing', IMAGE_FILE),
    ).resolves.toBeUndefined();
  });
});
