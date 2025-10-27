import { Ast } from '@minddrop/ast';
import { EditorElements, EditorMarks } from '@minddrop/editor';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { useTranslation } from '@minddrop/i18n';
import { Icons } from '@minddrop/icons';
import { Markdown } from '@minddrop/markdown';
import { Selection } from '@minddrop/selection';
import * as Utils from '@minddrop/utils';
import { Ui } from '../Ui';

export interface MindDropApi {
  Ast: typeof Ast;
  EditorMarks: typeof EditorMarks;
  EditorElements: typeof EditorElements;
  Events: typeof Events;
  Fs: typeof Fs;
  Icons: typeof Icons;
  Markdown: typeof Markdown;
  Selection: typeof Selection;
  Ui: typeof Ui;
  Utils: typeof Utils;
  I18n: {
    translate: (key: string, options: I18nOptions) => string;
    useTranslation: (options: I18nOptions) => ReturnType<typeof useTranslation>;
  };
}

interface I18nOptions {
  namespace?: string;
  keyPrefix?: string;
}
