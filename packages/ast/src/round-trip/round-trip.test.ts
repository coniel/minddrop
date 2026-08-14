import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as Ast from '../Ast';

const fixturesDir = join(__dirname, 'fixtures');

const fixtures = readdirSync(fixturesDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

describe('round trip', () => {
  // Every fixture must survive a parse and serialize byte for byte, since
  // the document on disk is the user's own file rather than something the
  // app owns
  fixtures.forEach((name) => {
    it(`preserves ${name} byte for byte`, () => {
      const source = readFileSync(join(fixturesDir, name), 'utf8');

      expect(Ast.toMarkdown(Ast.fromMarkdown(source))).toBe(source);
    });
  });

  it('preserves a document using CRLF line endings', () => {
    const source = '# Heading\r\n\r\nA paragraph.\r\n';

    expect(Ast.toMarkdown(Ast.fromMarkdown(source))).toBe(source);
  });

  it('preserves an empty document', () => {
    expect(Ast.toMarkdown(Ast.fromMarkdown(''))).toBe('');
  });

  it('preserves a document which is only whitespace', () => {
    const source = '\n\n\n';

    expect(Ast.toMarkdown(Ast.fromMarkdown(source))).toBe(source);
  });
});
