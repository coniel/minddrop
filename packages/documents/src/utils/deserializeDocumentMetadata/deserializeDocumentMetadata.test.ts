import { describe, it, expect } from 'vitest';
import { deserializeDocumentMetadata } from './deserializeDocumentMetadata';
import { DefaultDocumentMetadata } from '../../constants';
import { DocumentMetadata } from '../../types';
import { UserIconType } from '@minddrop/icons';

const markdownFileContent = `---
icon: content-icon:cat:cyan
---

# Title`;

describe('getDocumentMetadata', () => {
  it('returns document metadata', () => {
    expect(deserializeDocumentMetadata(markdownFileContent)).toEqual<DocumentMetadata>({
      icon: {
        type: UserIconType.ContentIcon,
        icon: 'cat',
        color: 'cyan',
      },
    });
  });

  it('returns default metadata if document has no metadata', () => {
    expect(deserializeDocumentMetadata('')).toEqual(DefaultDocumentMetadata);
  });

  it('returns default metadata if document has empty metadata', () => {
    expect(deserializeDocumentMetadata('---\n---\n')).toEqual(DefaultDocumentMetadata);
  });
});
