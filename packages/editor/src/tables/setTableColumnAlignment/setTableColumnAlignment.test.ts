import { afterEach, describe, expect, it } from 'vitest';
import { TableElement } from '@minddrop/ast';
import { cleanup, createTestEditor, generateTestTable } from '../../test-utils';
import { setTableColumnAlignment } from './setTableColumnAlignment';

describe('setTableColumnAlignment', () => {
  afterEach(cleanup);

  it('sets the alignment of the given column', () => {
    const editor = createTestEditor([
      generateTestTable([
        ['a', 'b'],
        ['c', 'd'],
      ]),
    ]);

    setTableColumnAlignment(editor, [0], 1, 'center');

    expect((editor.children[0] as TableElement).align).toEqual([
      null,
      'center',
    ]);
  });

  it('clears the alignment of the given column', () => {
    const editor = createTestEditor([
      generateTestTable(
        [
          ['a', 'b'],
          ['c', 'd'],
        ],
        ['left', 'right'],
      ),
    ]);

    setTableColumnAlignment(editor, [0], 0, null);

    expect((editor.children[0] as TableElement).align).toEqual([null, 'right']);
  });
});
