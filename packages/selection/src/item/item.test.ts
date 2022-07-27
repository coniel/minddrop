import { Resources, ResourceReference } from '@minddrop/resources';
import { item } from './item';

const document = Resources.generateDocument('tests:document', {});
const parent = Resources.generateDocument('tests:parent', {});

const reference: ResourceReference = {
  resource: 'tests:document',
  id: 'document-id',
};
const parentReference: ResourceReference = {
  resource: 'tests:parent',
  id: 'parent-id',
};

describe('item', () => {
  it('returns a selection item given a resource document', () => {
    // Generate a selection from a resource document
    expect(item(document)).toEqual({
      resource: document.resource,
      id: document.id,
    });
  });

  it('returns a selection item given a resource document and parent resource document', () => {
    // Generate a selection item from a resource document
    // and a parent resource document.
    expect(item(document, parent)).toEqual({
      resource: document.resource,
      id: document.id,
      parent: {
        resource: parent.resource,
        id: parent.id,
      },
    });
  });

  it('returns a selection item given a resource reference', () => {
    // Generate a selection from a resource reference
    expect(item(reference)).toEqual({
      resource: reference.resource,
      id: reference.id,
    });
  });

  it('returns a selection item given a resource reference and parent resource reference', () => {
    // Generate a selection item from a resource reference
    // and parent resource reference.
    expect(item(reference, parentReference)).toEqual({
      resource: reference.resource,
      id: reference.id,
      parent: {
        resource: parentReference.resource,
        id: parentReference.id,
      },
    });
  });
});
