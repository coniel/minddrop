import { MarkdownLineParser } from './types';

let parsers: MarkdownLineParser[] = [];

function add(parser: MarkdownLineParser): void {
  parsers.push(parser);
}

function remove(parser: MarkdownLineParser): void {
  parsers = parsers.filter((p) => p !== parser);
}

function getAll(): MarkdownLineParser[] {
  return parsers;
}

function clear(): void {
  parsers = [];
}

export const MarkdownLineParsersStore = {
  add,
  remove,
  getAll,
  clear,
};
