import { Assets } from '@minddrop/assets';
import { Ast } from '@minddrop/ast';
import { Documents, DocumentViews } from '@minddrop/documents';
import { EditorMarks, EditorElements } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import { Blocks } from '../../blocks/src';
import { Selection } from '@minddrop/Selection';
import { Workspaces } from '@minddrop/workspaces';
import * as Utils from '@minddrop/utils';
import { MindDropApi as Api } from './types';
import { Ui } from './Ui';

export const MindDropApi: Api = {
  Assets,
  Ast,
  Documents,
  DocumentViews,
  EditorMarks,
  EditorElements,
  Events,
  Fs,
  Icons,
  Markdown,
  Blocks,
  Selection,
  Ui,
  Utils,
  Workspaces,
};
