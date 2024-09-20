import { describe, it, expect } from 'vitest';
import { toMindDropDataTransfer } from './toMindDropDataTransfer';

const createFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item(index: number): File {
      // @ts-ignore
      return fileList[index];
    },
  };
  files.forEach((file, index) => {
    // @ts-ignore
    fileList[index] = file;
  });

  return fileList as unknown as FileList;
};

const createDataTransfer = ({
  data,
  files = createFileList([]),
}: {
  data: Record<string, string>;
  files?: FileList;
}): DataTransfer => {
  const dataTransfer = {
    types: Object.keys(data),
    data,
    getData: (key: string) => dataTransfer.data[key],
    files,
  };

  return dataTransfer as unknown as DataTransfer;
};

describe('toMindDropDataTransfer', () => {
  it('sets "insert" as action if minddrop action is not present', () => {
    const dataTransfer = createDataTransfer({
      data: {},
    });

    const result = toMindDropDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: [],
      data: {},
    });
  });

  it('sets minddrop action if present', () => {
    const dataTransfer = createDataTransfer({
      data: { 'minddrop/action': 'copy' },
    });

    const result = toMindDropDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'copy',
      types: [],
      data: {},
    });
  });

  it('adds all raw data types and their data', () => {
    const dataTransfer = createDataTransfer({
      data: {
        'text/plain': 'Hello world',
        'text/html': '<p>Hello world</p>',
      },
    });

    const result = toMindDropDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: ['text/plain', 'text/html'],
      data: {
        'text/plain': 'Hello world',
        'text/html': '<p>Hello world</p>',
      },
    });
  });

  it('adds files if present', () => {
    const textFile = {
      name: 'file.txt',
    } as unknown as File;
    const dataTransfer = createDataTransfer({
      data: {},
      files: createFileList([textFile]),
    });

    const result = toMindDropDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: [],
      data: {},
      files: [textFile],
    });
  });

  it('adds `text/uri-list` if present', () => {
    const dataTransfer = createDataTransfer({
      data: {
        'text/uri-list': 'https://ibguides.com',
      },
    });
    const result = toMindDropDataTransfer(dataTransfer);
    expect(result).toEqual({
      action: 'insert',
      types: ['text/uri-list'],
      data: {
        'text/uri-list': 'https://ibguides.com',
      },
    });
  });

  it('adds `text/uri-list` data if the plain text is a URL', () => {
    const dataTransfer = createDataTransfer({
      data: {
        'text/plain': 'https://ibguides.com',
      },
    });

    const result = toMindDropDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: ['text/uri-list', 'text/plain'],
      data: {
        'text/plain': 'https://ibguides.com',
        'text/uri-list': 'https://ibguides.com',
      },
    });
  });
});
