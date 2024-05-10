import { describe, it, expect } from 'vitest';
import { deserializePageMetadata } from './deserializePageMetadata';
import { DefaultPageMetadata } from '../../constants';
import { PageMetadata } from '../../types';
import { UserIconType } from '@minddrop/icons';

const markdownFileContent = `---
icon: content-icon:cat:cyan
---

# Title`;

describe('getPageMetadata', () => {
  it('returns page metadata', () => {
    expect(deserializePageMetadata(markdownFileContent)).toEqual<PageMetadata>({
      icon: {
        type: UserIconType.ContentIcon,
        icon: 'cat',
        color: 'cyan',
      },
    });
  });

  it('returns default metadata if page has no metadata', () => {
    expect(deserializePageMetadata('')).toEqual(DefaultPageMetadata);
  });

  it('returns default metadata if page has empty metadata', () => {
    expect(deserializePageMetadata('---\n---\n')).toEqual(DefaultPageMetadata);
  });
});
