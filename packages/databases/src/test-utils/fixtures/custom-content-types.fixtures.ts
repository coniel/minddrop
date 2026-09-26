import { CustomContentType } from '../../types';

export const customContentType_file_1: CustomContentType = {
  id: 'custom-content-type_file_1',
  name: '3D models',
  kind: 'file',
  matchers: ['stl', 'obj'],
  databaseId: null,
};

export const customContentType_url_1: CustomContentType = {
  id: 'custom-content-type_url_1',
  name: 'Code',
  kind: 'url',
  matchers: ['github.com', '*.gitlab.com'],
  databaseId: null,
};

export const customContentTypes = [
  customContentType_file_1,
  customContentType_url_1,
];
