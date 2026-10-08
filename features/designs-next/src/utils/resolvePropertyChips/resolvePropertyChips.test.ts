import { describe, expect, it } from 'vitest';
import { SelectPropertySchema, TagsPropertySchema } from '@minddrop/properties';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { resolvePropertyChips } from './resolvePropertyChips';

const { tag_1, tag_2, tags } = TagFixtures;

// A select property with two coloured options
const selectSchema: SelectPropertySchema = {
  type: 'select',
  name: 'Status',
  options: [
    { value: 'Open', color: 'green' },
    { value: 'Done', color: 'blue' },
  ],
};

// A tags property
const tagsSchema: TagsPropertySchema = { type: 'tags', name: 'Tags' };

describe('resolvePropertyChips', () => {
  it('colours a select value by its option', () => {
    expect(resolvePropertyChips('Done', selectSchema, [])).toEqual([
      { value: 'Done', color: 'blue' },
    ]);
  });

  it("resolves each of a multiselect's values", () => {
    expect(resolvePropertyChips(['Open', 'Done'], selectSchema, [])).toEqual([
      { value: 'Open', color: 'green' },
      { value: 'Done', color: 'blue' },
    ]);
  });

  it('gives a value matching no option the default colour', () => {
    expect(resolvePropertyChips('Unknown', selectSchema, [])).toEqual([
      { value: 'Unknown', color: 'default' },
    ]);
  });

  it('matches a select option by exact case', () => {
    expect(resolvePropertyChips('open', selectSchema, [])).toEqual([
      { value: 'open', color: 'default' },
    ]);
  });

  it('colours a tags value by its tag', () => {
    expect(
      resolvePropertyChips([tag_1.name, tag_2.name], tagsSchema, tags),
    ).toEqual([
      { value: tag_1.name, color: tag_1.color },
      { value: tag_2.name, color: tag_2.color },
    ]);
  });

  it('matches a tag regardless of case', () => {
    expect(
      resolvePropertyChips([tag_1.name.toUpperCase()], tagsSchema, tags),
    ).toEqual([{ value: tag_1.name.toUpperCase(), color: tag_1.color }]);
  });

  it('gives a value matching no tag the default colour', () => {
    expect(resolvePropertyChips(['Missing'], tagsSchema, tags)).toEqual([
      { value: 'Missing', color: 'default' },
    ]);
  });

  it('resolves no chips for an empty value', () => {
    expect(resolvePropertyChips(null, selectSchema, [])).toEqual([]);
    expect(resolvePropertyChips('', selectSchema, [])).toEqual([]);
    expect(resolvePropertyChips([], tagsSchema, tags)).toEqual([]);
  });

  it('resolves no chips for a property of another type', () => {
    expect(
      resolvePropertyChips('Text', { type: 'text', name: 'Summary' }, []),
    ).toEqual([]);
  });
});
