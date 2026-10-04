import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { EntityGroups } from '@minddrop/entity-groups';
import { SelectPropertySchema } from '@minddrop/properties';
import { QueryFilterNode, QuerySortNode } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { TagGroups } from '@minddrop/tags';
import {
  TagFixtures,
  TagGroupFixtures,
  cleanupTagFixtures,
  setupTagFixtures,
} from '@minddrop/tags/test-utils';
import { MockFs } from '../../test-utils';
import { reconcileQueryNodesWithProperties } from './reconcileQueryNodesWithProperties';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's filter node, filtering by title
const filterNode = query_1.nodes[1] as QueryFilterNode;

// A sort node sorting by the object database's content property
const sortNode: QuerySortNode = {
  id: 'query-node_sort',
  type: 'sort',
  x: 0,
  y: 0,
  property: 'Content',
  propertyType: 'content',
  direction: 'descending',
};

// A filter node filtering by the object database's content
// property.
const contentFilter: QueryFilterNode = {
  ...filterNode,
  id: 'query-node_content-filter',
  property: 'Content',
  propertyType: 'content',
};

describe('reconcileQueryNodesWithProperties', () => {
  it('resets filter nodes whose property is missing', () => {
    const [node] = reconcileQueryNodesWithProperties(
      [contentFilter],
      Databases.withImplicitMetadataProperties(urlDatabase.properties),
    );

    expect(node).toEqual({
      ...contentFilter,
      property: '',
      propertyType: '',
      operator: '',
      value: undefined,
    });
  });

  it('resets sort nodes whose property is missing, keeping the direction', () => {
    const [node] = reconcileQueryNodesWithProperties(
      [sortNode],
      Databases.withImplicitMetadataProperties(urlDatabase.properties),
    );

    expect(node).toEqual({ ...sortNode, property: '', propertyType: '' });
  });

  it('keeps nodes whose property is available', () => {
    // Both databases have the implicit title property
    const nodes = [filterNode, sortNode];

    const result = reconcileQueryNodesWithProperties(
      nodes,
      Databases.withImplicitMetadataProperties(objectDatabase.properties),
    );

    expect(result).toEqual(nodes);
  });

  it('resets nodes whose property exists with a different type', () => {
    const [node] = reconcileQueryNodesWithProperties(
      [{ ...sortNode, propertyType: 'text' }],
      Databases.withImplicitMetadataProperties(objectDatabase.properties),
    );

    expect(node).toMatchObject({ property: '', propertyType: '' });
  });

  it('leaves other node types untouched', () => {
    const [sourceNode, , resultsNode] = query_1.nodes;

    expect(
      reconcileQueryNodesWithProperties([sourceNode, resultsNode], []),
    ).toEqual([sourceNode, resultsNode]);
  });

  describe('select filters', () => {
    // A select property offering two options
    const statusProperty: SelectPropertySchema = {
      type: 'select',
      name: 'Status',
      options: [
        { value: 'Open', color: 'blue' },
        { value: 'Done', color: 'green' },
      ],
    };

    // Returns a filter on the status property with the given value
    function statusFilter(value: QueryFilterNode['value']): QueryFilterNode {
      return {
        ...filterNode,
        property: 'Status',
        propertyType: 'select',
        operator: 'is',
        value,
      };
    }

    it('drops values the property does not offer', () => {
      const [node] = reconcileQueryNodesWithProperties(
        [statusFilter(['Open', 'Blocked'])],
        [statusProperty],
      );

      expect(node).toEqual(statusFilter(['Open']));
    });

    it('clears the value when no values remain', () => {
      const [node] = reconcileQueryNodesWithProperties(
        [statusFilter(['Blocked'])],
        [statusProperty],
      );

      expect(node).toEqual(statusFilter(undefined));
    });

    it('clears a single value the property does not offer', () => {
      const [node] = reconcileQueryNodesWithProperties(
        [statusFilter('Blocked')],
        [statusProperty],
      );

      expect(node).toEqual(statusFilter(undefined));
    });
  });

  describe('tags filters', () => {
    const { tag_1, tag_2 } = TagFixtures;
    const { tagGroup_1 } = TagGroupFixtures;

    // A filter on a tags property matching the first two tags
    const tagsFilter: QueryFilterNode = {
      ...filterNode,
      property: 'Tags',
      propertyType: 'tags',
      operator: 'contains-any',
      value: [tag_1.name, tag_2.name],
    };

    beforeEach(() => {
      setupTagFixtures(MockFs, {
        loadTags: true,
        loadTagGroups: false,
        loadTagFiles: false,
        loadTagGroupFiles: false,
      });

      // A group holding only the first tag
      EntityGroups.Store.load([
        {
          type: TagGroups.constants.Type,
          groups: [{ ...tagGroup_1, items: [tag_1.id] }],
        },
      ]);
    });

    afterEach(() => {
      cleanupTagFixtures();
    });

    it("drops tags outside the property's group", () => {
      const [node] = reconcileQueryNodesWithProperties(
        [tagsFilter],
        [{ type: 'tags', name: 'Tags', group: tagGroup_1.id }],
      );

      expect(node).toEqual({ ...tagsFilter, value: [tag_1.name] });
    });

    it('keeps every tag when the property has no group', () => {
      const [node] = reconcileQueryNodesWithProperties(
        [tagsFilter],
        [{ type: 'tags', name: 'Tags' }],
      );

      expect(node).toEqual(tagsFilter);
    });
  });
});
