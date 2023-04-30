import { FileEntry } from '@minddrop/core';
import { Topic } from '../types';

export const Topic_1_2_1: Topic = {
  name: 'Topic 1.2.1',
  isDir: false,
  subtopics: {},
};

export const Topic_1_1: Topic = {
  name: 'Topic 1.1',
  isDir: false,
  subtopics: {},
};

export const Topic_1_2: Topic = {
  name: 'Topic 1.2',
  isDir: true,
  subtopics: {
    [Topic_1_2_1.name]: Topic_1_2_1,
  },
};

export const Topic_1: Topic = {
  name: 'Topic 1',
  isDir: true,
  subtopics: {
    [Topic_1_1.name]: Topic_1_1,
    [Topic_1_2.name]: Topic_1_2,
  },
};

export const Topic_2: Topic = {
  name: 'Topic 2',
  isDir: true,
  subtopics: {},
};

export const Topic_Unnamed: Topic = {
  name: 'Unnamed',
  isDir: false,
  subtopics: {},
};

// Not included as a root or sub topic in topics
export const Topic_Unnamed_2: Topic = {
  name: 'Unnamed 2',
  isDir: false,
  subtopics: {},
};

export const topics = {
  [Topic_1.name]: Topic_1,
  [Topic_2.name]: Topic_2,
  [Topic_Unnamed.name]: Topic_Unnamed,
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
        path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.2.md',
      },
      {
        name: 'Topic 1.1.md',
        path: '/Users/foo/Documents/minddrop/Topic 1/Topic 1.1.md',
      },
    ],
    name: 'Topic 1',
    path: '/Users/foo/Documents/minddrop/Topic 1.md',
  },
  {
    children: [],
    name: 'Topic 2',
    path: '/Users/foo/Documents/minddrop/Topic 2.md',
  },
  {
    name: 'Unnamed.md',
    path: '/Users/foo/Documents/minddrop/Unnamed.md',
  },
];
