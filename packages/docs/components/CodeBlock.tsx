/* eslint-disable react/no-danger */
// Inspired by https://github.com/rexxars/react-refractor
import React from 'react';
import { refractor } from 'refractor';
import js from 'refractor/lang/javascript';
import ts from 'refractor/lang/typescript';
import jsx from 'refractor/lang/jsx';
import tsx from 'refractor/lang/tsx';
import bash from 'refractor/lang/bash';
import css from 'refractor/lang/css';
import diff from 'refractor/lang/diff';
import { toHtml } from 'hast-util-to-html';
import rangeParser from 'parse-numeric-range';
import highlightLine from '@lib/rehype-highlight-line';
import highlightWord from '@lib/rehype-highlight-word';
import { Pre } from './Pre';

refractor.register(js);
refractor.register(ts);
refractor.register(jsx);
refractor.register(tsx);
refractor.register(bash);
refractor.register(css);
refractor.register(diff);

type PreProps = Omit<React.ComponentProps<typeof Pre>, 'css'>;

type CodeBlockProps = PreProps & {
  language: 'js' | 'jsx' | 'ts' | 'tsx' | 'bash' | 'css' | 'diff';
  value: string;
  line?: string;
  css?: any;
  showLineNumbers?: boolean;
};

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
  (_props, forwardedRef) => {
    const {
      language,
      value,
      line = '0',
      className = '',
      css,
      variant,
      showLineNumbers,
      ...props
    } = _props;

    const result = refractor.highlight(value, language);
    const highlightedLines = highlightLine(result, rangeParser(line));
    const highlightedWords = highlightWord(highlightedLines);
    const html = toHtml(highlightedWords);

    const classes = `language-${language} ${className}`;

    return (
      <Pre
        ref={forwardedRef}
        className={classes}
        css={css}
        variant={variant}
        data-line-numbers={showLineNumbers}
        {...props}
      >
        <code className={classes} dangerouslySetInnerHTML={{ __html: html }} />
      </Pre>
    );
  },
);
