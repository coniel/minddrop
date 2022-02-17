import { createDataInsertFromDataTransfer } from './createDataInsertFromDataTransfer';

const createFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item(index: number): File {
      return fileList[index];
    },
  };
  files.forEach((file, index) => {
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

describe('createDataInsertFromDataTransfer', () => {
  it('sets "insert" as action if minddrop action is not present', () => {
    const dataTransfer = createDataTransfer({
      data: {},
    });

    const result = createDataInsertFromDataTransfer(dataTransfer);

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

    const result = createDataInsertFromDataTransfer(dataTransfer);

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

    const result = createDataInsertFromDataTransfer(dataTransfer);

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

    const result = createDataInsertFromDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: [],
      data: {},
      files: [textFile],
    });
  });

  it('adds the minddrop source if present', () => {
    const dataTransfer = createDataTransfer({
      data: { 'minddrop/source': '{"type":"topic","id": "topic-id"}' },
    });

    const result = createDataInsertFromDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: [],
      data: {},
      source: {
        type: 'topic',
        id: 'topic-id',
      },
    });
  });

  it('adds the minddrop drops if present', () => {
    const dataTransfer = createDataTransfer({
      data: { 'minddrop/drops': '["drop-1-id","drop-2-id"]' },
    });

    const result = createDataInsertFromDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: [],
      data: {},
      drops: ['drop-1-id', 'drop-2-id'],
    });
  });

  it('adds the minddrop topics if present', () => {
    const dataTransfer = createDataTransfer({
      data: { 'minddrop/topics': '["topic-1-id","topic-2-id"]' },
    });

    const result = createDataInsertFromDataTransfer(dataTransfer);

    expect(result).toEqual({
      action: 'insert',
      types: [],
      data: {},
      topics: ['topic-1-id', 'topic-2-id'],
    });
  });
});
