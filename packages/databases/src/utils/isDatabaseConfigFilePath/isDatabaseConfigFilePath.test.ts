import { describe, expect, it } from 'vitest';
import { isDatabaseConfigFilePath } from './isDatabaseConfigFilePath';

describe('isDatabaseConfigFilePath', () => {
  it('is true for a database config file', () => {
    expect(
      isDatabaseConfigFilePath('workspace/Books/.minddrop/database.json'),
    ).toBe(true);
  });

  it('is true for a config file in a nested database', () => {
    expect(
      isDatabaseConfigFilePath(
        'workspace/Reading/Books/.minddrop/database.json',
      ),
    ).toBe(true);
  });

  it('is false for other files in the hidden directory', () => {
    expect(
      isDatabaseConfigFilePath('workspace/Books/.minddrop/metadata.json'),
    ).toBe(false);
  });

  it('is false for a config file outside a hidden directory', () => {
    expect(isDatabaseConfigFilePath('workspace/Books/database.json')).toBe(
      false,
    );
  });

  it('is false for entry files', () => {
    expect(isDatabaseConfigFilePath('workspace/Books/Dune.md')).toBe(false);
  });
});
