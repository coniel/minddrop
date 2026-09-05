import { describe, expect, it } from 'vitest';
import { SelectPropertyOption } from '@minddrop/properties';
import { resolveReorderedOptions } from './resolveReorderedOptions';

const options: SelectPropertyOption[] = [
  { value: 'Todo', color: 'blue' },
  { value: 'Doing', color: 'orange' },
  { value: 'Done', color: 'green' },
];

describe('resolveReorderedOptions', () => {
  it('reorders the options to match the value order', () => {
    const result = resolveReorderedOptions(options, ['Done', 'Todo', 'Doing']);

    expect(result.map((option) => option.value)).toEqual([
      'Done',
      'Todo',
      'Doing',
    ]);
  });

  it('keeps unlisted options in their original positions', () => {
    const result = resolveReorderedOptions(options, ['Done', 'Todo']);

    expect(result.map((option) => option.value)).toEqual([
      'Done',
      'Doing',
      'Todo',
    ]);
  });

  it('drops values which no longer name an option', () => {
    const result = resolveReorderedOptions(options, [
      'Done',
      'Removed',
      'Todo',
      'Doing',
    ]);

    expect(result.map((option) => option.value)).toEqual([
      'Done',
      'Todo',
      'Doing',
    ]);
  });
});
