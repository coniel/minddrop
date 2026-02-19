const createFileList = (files: File[]): FileList => {
  const fileList = {
    length: files.length,
    item(index: number): File {
      // @ts-expect-error - We know the index is within bounds.
      return fileList[index];
    },
  };
  files.forEach((file, index) => {
    // @ts-expect-error - We know the index is within bounds.
    fileList[index] = file;
  });

  return fileList as unknown as FileList;
};

/**
 * Creates a new data transfer object.
 * @param data - The data to include in the data transfer object.
 * @param files - The files to include in the data transfer object.
 * @returns The data transfer object.
 */
export const createDataTransfer = (
  data: Record<string, string>,
  files: File[] = [],
): DataTransfer => {
  const dataTransfer = {
    types: Object.keys(data),
    data,
    getData: (key: string) => dataTransfer.data[key],
    setData: (key: string, value: string) => {
      dataTransfer.data[key] = value;
      dataTransfer.types = Object.keys(dataTransfer.data);
    },
    clearData: (key: string) => {
      delete dataTransfer.data[key];
      dataTransfer.types = Object.keys(dataTransfer.data);
    },
    files: createFileList(files),
  };

  return dataTransfer as unknown as DataTransfer;
};
