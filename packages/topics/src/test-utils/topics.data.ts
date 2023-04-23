import { FileEntry } from '@minddrop/core';
import { Topic } from '../types';

export const Topic_1_2_1: Topic = {
  title: 'Topic 1.2.1',
  filename: 'Topic 1.2.1.md',
  isDir: false,
  subtopics: {},
};

export const Topic_1_1: Topic = {
  title: 'Topic 1.1',
  filename: 'Topic 1.1.md',
  isDir: false,
  subtopics: {},
};

export const Topic_1_2: Topic = {
  title: 'Topic 1.2',
  filename: 'Topic 1.2',
  isDir: true,
  subtopics: {
    [Topic_1_2_1.filename]: Topic_1_2_1,
  },
};

export const Topic_1: Topic = {
  title: 'Topic 1',
  filename: 'Topic 1',
  isDir: true,
  subtopics: {
    [Topic_1_1.filename]: Topic_1_1,
    [Topic_1_2.filename]: Topic_1_2,
  },
};

export const Topic_2: Topic = {
  title: 'Topic 2',
  filename: 'Topic 2',
  isDir: true,
  subtopics: {},
};

export const Topic_Untitled: Topic = {
  title: 'Untitled',
  filename: 'Untitled.md',
  isDir: false,
  subtopics: {},
};

// Not included as a root or sub topic in topics
export const Topic_Untitled_2: Topic = {
  title: 'Untitled 2',
  filename: 'Untitled 2.md',
  isDir: false,
  subtopics: {},
};

export const topics = {
  [Topic_1.filename]: Topic_1,
  [Topic_2.filename]: Topic_2,
  [Topic_Untitled.filename]: Topic_Untitled,
};

export const topicFiles: FileEntry[] = [
  {
    name: '.DS_Store',
    path: '/Users/foo/Documents/minddrop/.DS_Store',
  },
  {
    children: [
      {
        name: 'Topic 1.md',
        path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.md',
      },
      {
        name: '.DS_Store',
        path: '/Users/foo/Documents/minddrop/Topic 1/.DS_Store',
      },
      {
        children: [
          {
            name: 'Topic 1.2.md',
            path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.2/Topic 1.2.md',
          },
          {
            name: 'Topic 1.2.1.md',
            path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.2/Topic 1.2.1.md',
          },
        ],
        name: 'Topic 1.2',
        path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.2',
      },
      {
        name: 'Topic 1.1.md',
        path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.1.md',
      },
    ],
    name: 'Topic 1',
    path: '/Users/foo/Documents/minddrop/Topic 1',
  },
  {
    children: [],
    name: 'Topic 2',
    path: '/Users/foo/Documents/minddrop/Topic 2',
  },
  {
    name: 'Untitled.md',
    path: '/Users/foo/Documents/minddrop/Untitled.md',
  },
];
