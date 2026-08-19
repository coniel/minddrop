import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanupDataViewFixtures,
  setupDataViewFixtures,
} from '@minddrop/data-views';
import { DesignFixtures, ViewElement, createElement } from '@minddrop/designs';
import { MockFs, cleanup, setup } from '../../test-utils';
import { isPropertyCompatibleWithElement } from './isPropertyCompatibleWithElement';

const { element_text_1, element_container_1 } = DesignFixtures;

describe('isPropertyCompatibleWithElement', () => {
  beforeEach(() => {
    setup();

    // View type compatibility is checked against the registered
    // data view types
    setupDataViewFixtures(MockFs);
  });

  afterEach(() => {
    cleanupDataViewFixtures();
    cleanup();
  });

  it('returns false for static elements', () => {
    const staticElement = { ...element_text_1, static: true };

    expect(isPropertyCompatibleWithElement('text', staticElement)).toBe(false);
  });

  it('returns false when the element type cannot render the property type', () => {
    // Text elements render text-like properties, not numbers
    expect(isPropertyCompatibleWithElement('number', element_text_1)).toBe(
      false,
    );
  });

  it('returns true when the element type can render the property type', () => {
    expect(isPropertyCompatibleWithElement('text', element_text_1)).toBe(true);
  });

  it('returns true for image properties on containers', () => {
    // Containers render an image property as their background
    expect(isPropertyCompatibleWithElement('image', element_container_1)).toBe(
      true,
    );
  });

  describe('view elements', () => {
    it('returns true when the view type supports the data source', () => {
      // The gallery view type supports collection data sources
      const viewElement = {
        ...(createElement('view') as ViewElement),
        viewType: 'gallery',
      };

      expect(isPropertyCompatibleWithElement('collection', viewElement)).toBe(
        true,
      );
    });

    it('returns false when the view type is not registered', () => {
      const viewElement = {
        ...(createElement('view') as ViewElement),
        viewType: 'nonexistent',
      };

      expect(isPropertyCompatibleWithElement('collection', viewElement)).toBe(
        false,
      );
    });

    it('returns false for property types carrying no data source', () => {
      const viewElement = createElement('view') as ViewElement;

      expect(isPropertyCompatibleWithElement('text', viewElement)).toBe(false);
    });
  });
});
