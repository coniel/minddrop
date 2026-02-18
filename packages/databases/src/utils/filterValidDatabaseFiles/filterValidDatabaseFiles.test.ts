// import { afterEach, beforeEach, describe, expect, it } from 'vitest';
// import { InvalidParameterError } from '@minddrop/utils';
// import {
//   cleanup,
//   fileDatabase,
//   objectDatabase,
//   pdfDatabase,
//   setup,
// } from '../../test-utils';
// import { filterValidDatabaseFiles } from './filterValidDatabaseFiles';
//
// const pdfFile = {
//   name: 'valid.pdf',
// } as File;
//
// const textFile = {
//   name: 'invalid.txt',
// } as File;
//
// describe.skip('filterValidDatabaseFiles', () => {
//   beforeEach(setup);
//
//   afterEach(cleanup);
//
//   it('throws if the database is not a file based database', () => {
//     expect(() =>
//       filterValidDatabaseFiles(objectDatabase.id, [pdfFile]),
//     ).toThrowError(InvalidParameterError);
//   });
//
//   it('filters files by validity', () => {
//     const { validFiles, invalidFiles } = filterValidDatabaseFiles(
//       pdfDatabase.id,
//       [pdfFile, textFile],
//     );
//
//     expect(validFiles).toEqual([pdfFile]);
//     expect(invalidFiles).toEqual([textFile]);
//   });
//
//   it('returns all files if the data type does not enforce file types', () => {
//     const { validFiles, invalidFiles } = filterValidDatabaseFiles(
//       fileDatabase.id,
//       [pdfFile, textFile],
//     );
//
//     expect(validFiles).toEqual([pdfFile, textFile]);
//     expect(invalidFiles).toEqual([]);
//   });
// });
