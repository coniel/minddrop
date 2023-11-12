import { UserIconType } from '@minddrop/icons';
import { DefaultPageIcon } from '../constants';
import { Page } from '../types';

export const page1: Page = {
  path: 'Users/foo/Documents/Page 1.md',
  title: 'Page 1',
  icon: { type: UserIconType.ContentIcon, icon: 'cat', color: 'cyan' },
  wrapped: false,
};

export const wrappedPage: Page = {
  path: 'Users/foo/Documents/Page 2/Page 2.md',
  title: 'Page 2',
  wrapped: true,
  icon: DefaultPageIcon,
};

export const pages = [page1, wrappedPage];
