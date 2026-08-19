import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignRoleNotRegisteredError } from '../errors';
import { PageContentRole, TitleRole } from '../roles';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { createRoleElement } from './createRoleElement';

const { design_books, layout_card_1 } = DesignFixtures;

describe('createRoleElement', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('creates an element of the role base type carrying the role ID', () => {
    const element = createRoleElement(
      TitleRole.id,
      design_books,
      layout_card_1,
    );

    expect(element.type).toBe('text');
    expect(element.role).toBe(TitleRole.id);
  });

  it('auto-binds to the first compatible unbound property', () => {
    const element = createRoleElement(
      TitleRole.id,
      design_books,
      layout_card_1,
    );

    // 'Title' is the design's only title property
    expect(element.property).toBe('Title');
  });

  it('leaves the element unbound when no compatible property exists', () => {
    // Bind-less designs leave the element unbound
    const element = createRoleElement(
      TitleRole.id,
      { ...design_books, properties: [] },
      layout_card_1,
    );

    expect(element.property).toBeUndefined();
  });

  it('leaves structural roles unbound', () => {
    const element = createRoleElement(
      PageContentRole.id,
      design_books,
      layout_card_1,
    );

    expect(element.property).toBeUndefined();
  });

  it('throws when the role is not registered', () => {
    expect(() =>
      createRoleElement('unknown', design_books, layout_card_1),
    ).toThrow(DesignRoleNotRegisteredError);
  });
});
