import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { createPropertyElement } from './createPropertyElement';

const { design_books, layout_card_1 } = DesignFixtures;

describe('createPropertyElement', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('creates a property element persisting its property type', () => {
    const element = createPropertyElement('text', design_books, layout_card_1);

    expect(element.type).toBe('property');
    expect(element.propertyType).toBe('text');
    expect(element.style).toEqual({});
  });

  it('auto-binds to the first compatible unbound property', () => {
    const element = createPropertyElement('text', design_books, layout_card_1);

    // 'Subtitle' is the design's first text property
    expect(element.property).toBe('Subtitle');
  });

  it('leaves the element unbound when no compatible property exists', () => {
    // The design has no date property
    const element = createPropertyElement('date', design_books, layout_card_1);

    expect(element.property).toBeUndefined();
  });

  it('survives a JSON round-trip unchanged', () => {
    const element = createPropertyElement('text', design_books, layout_card_1);

    expect(JSON.parse(JSON.stringify(element))).toEqual(element);
  });

  it('throws when the property type has no config', () => {
    expect(() =>
      createPropertyElement('toggle', design_books, layout_card_1),
    ).toThrow(InvalidParameterError);
  });
});
