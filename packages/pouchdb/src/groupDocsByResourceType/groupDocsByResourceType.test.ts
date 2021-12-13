import { deserializeResourceDocument } from '../deserializeResourceDocument';
import { groupDocsByResourceType } from './groupDocsByResourceType';

const item1 = {
  _id: 'item-1',
  resourceType: 'items:item',
  markdown: 'Hello',
};
const item2 = {
  _id: 'item-2',
  resourceType: 'items:item',
  markdown: 'World',
};
const item3 = {
  _id: 'item-3',
  resourceType: 'foos:foo',
};
const deserializedItem1 = deserializeResourceDocument(item1);
const deserializedItem2 = deserializeResourceDocument(item2);
const deserializedItem3 = deserializeResourceDocument(item3);

describe('groupDocsByResourceType', () => {
  it('groups docs by type', () => {
    const result = groupDocsByResourceType([item1, item2, item3]);

    expect(result['items:item']).toEqual([
      deserializedItem1,
      deserializedItem2,
    ]);
    expect(result['foos:foo']).toEqual([deserializedItem3]);
  });
});
