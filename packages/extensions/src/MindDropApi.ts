import { Selection } from '@minddrop/Selection';
import { Assets } from '@minddrop/assets';
import { Ast } from '@minddrop/ast';
import { DocumentViews, Documents } from '@minddrop/documents';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import * as Utils from '@minddrop/utils';
import { Workspaces } from '@minddrop/workspaces';
import { Blocks } from '../../blocks/src';
import { Ui } from './Ui';
import { MindDropApi as Api } from './types';

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
