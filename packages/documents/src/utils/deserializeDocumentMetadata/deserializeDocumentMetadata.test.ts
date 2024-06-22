import { describe, it, expect } from 'vitest';
import { Icons, UserIconType } from '@minddrop/icons';
import { deserializeDocumentMetadata } from './deserializeDocumentMetadata';
import { DocumentProperties } from '../../types';
import { DefaultDocumentMetadata } from '../../constants';

const markdownFileContent = `---
icon: content-icon:cat:cyan
---

# Title`;

describe('getDocumentMetadata', () => {
  it('returns document metadata', () => {
    expect(
      deserializeDocumentMetadata(markdownFileContent),
    ).toEqual<DocumentProperties>({
      icon: Icons.stringify({
        type: UserIconType.ContentIcon,
        icon: 'cat',
        color: 'cyan',
      }),
    });
  });

  it('returns default metadata if document has no metadata', () => {
    expect(deserializeDocumentMetadata('')).toEqual(DefaultDocumentMetadata);
  });

  it('returns default metadata if document has no metadata', () => {
    expect(deserializeDocumentMetadata('')).toEqual(DefaultDocumentMetadata);
  });

  it('returns default metadata if document has empty metadata', () => {
    expect(deserializeDocumentMetadata('---\n---\n')).toEqual(
      DefaultDocumentMetadata,
    );
  });
});
