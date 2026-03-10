import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ContainerElement,
  DefaultContainerElementStyle,
  DefaultTextElementStyle,
  DefaultViewElementStyle,
  RootElement,
  TextElement,
  ViewElement,
} from '@minddrop/designs';
import { initializeMockFileSystem } from '@minddrop/file-system';
import {
  ViewFixtures,
  cleanupViewFixtures,
  setupViewFixtures,
} from '@minddrop/views';
import { isPropertyCompatibleWithElement } from './isPropertyCompatibleWithElement';

const MockFs = initializeMockFileSystem();

// -- Test fixtures --

const textElement: TextElement = {
  id: 'text-1',
  type: 'text',
  style: { ...DefaultTextElementStyle },
};

const containerElement: ContainerElement = {
  id: 'container-1',
  type: 'container',
  style: { ...DefaultContainerElementStyle },
  children: [],
};

const containerWithBackground: ContainerElement = {
  id: 'container-bg-1',
  type: 'container',
  style: {
    ...DefaultContainerElementStyle,
    backgroundImage: 'some-image.png',
  },
  children: [],
};

const rootElement: RootElement = {
  id: 'root-1',
  type: 'root',
  style: { ...DefaultContainerElementStyle },
  children: [],
};

const rootWithBackground: RootElement = {
  id: 'root-bg-1',
  type: 'root',
  style: {
    ...DefaultContainerElementStyle,
    backgroundImage: 'some-image.png',
  },
  children: [],
};

// View element using gallery view type (supports collection)
const viewElement: ViewElement = {
  id: 'view-1',
  type: 'view',
  viewType: 'gallery',
  style: { ...DefaultViewElementStyle },
};

// View element using board view type (supports collection but not query)
const viewElementBoard: ViewElement = {
  id: 'view-2',
  type: 'view',
  viewType: 'board',
  style: { ...DefaultViewElementStyle },
};

// View element with an unregistered view type
const viewElementUnregistered: ViewElement = {
  id: 'view-3',
  type: 'view',
  viewType: 'nonexistent',
  style: { ...DefaultViewElementStyle },
};

describe('isPropertyCompatibleWithElement', () => {
  beforeEach(() => {
    setupViewFixtures(MockFs);
  });

  afterEach(() => {
    cleanupViewFixtures();
    MockFs.reset();
  });

  it('returns false for static elements', () => {
    const staticElement: TextElement = {
      ...textElement,
      static: true,
    };

    expect(isPropertyCompatibleWithElement('text', staticElement)).toBe(false);
  });

  it('returns false when the property type does not support the element type', () => {
    // 'number' property type only maps to 'number' elements
    expect(isPropertyCompatibleWithElement('number', textElement)).toBe(false);
  });

  it('returns true for compatible property type and element type', () => {
    // 'text' property type maps to 'text' elements
    expect(isPropertyCompatibleWithElement('text', textElement)).toBe(true);
  });

  // -- View elements --

  it('returns true for view elements whose view type supports the data source', () => {
    // Gallery view type supports 'collection'
    expect(isPropertyCompatibleWithElement('collection', viewElement)).toBe(
      true,
    );
  });

  it('returns false for view elements whose view type does not support the data source', () => {
    // Board view type supports 'collection' but not 'query'
    // TODO: remove @ts-expect-error once query property type is added
    // @ts-expect-error query property type not yet defined
    expect(isPropertyCompatibleWithElement('query', viewElementBoard)).toBe(
      false,
    );
  });

  it('returns false for view elements with an unregistered view type', () => {
    expect(
      isPropertyCompatibleWithElement('collection', viewElementUnregistered),
    ).toBe(false);
  });

  // -- Image properties on containers and root --

  it('returns false for image property on container without background image', () => {
    expect(isPropertyCompatibleWithElement('image', containerElement)).toBe(
      false,
    );
  });

  it('returns true for image property on container with background image', () => {
    expect(
      isPropertyCompatibleWithElement('image', containerWithBackground),
    ).toBe(true);
  });

  it('returns false for image property on root without background image', () => {
    expect(isPropertyCompatibleWithElement('image', rootElement)).toBe(false);
  });

  it('returns true for image property on root with background image', () => {
    expect(isPropertyCompatibleWithElement('image', rootWithBackground)).toBe(
      true,
    );
  });
});
