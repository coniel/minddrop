import React from 'react';
import { cleanup, render } from '@minddrop/test-utils';
import { RichTextDocument } from '@minddrop/rich-text';
import { RichTextEditorPluginConfig } from '../types';
import { Editor } from './Editor';

// const TestPluging: RichTextEditorPluginConfig = {
//   elements: [
//     {
//       type: 'test-element',
//       component: ({ children, attributes }) => (
//         <div {...attributes}>
//           <span>test-element</span>
//           {children}
//         </div>
//       ),
//     },
//   ],
// };

// const document: RichTextDocument = {
//   revision: 'rev-id',
//   content: [{ id: 'id', type: 'test-element', children: [{ text: '' }] }],
// };

describe('Editor', () => {
  afterEach(cleanup);

  it('renders plugin elements', () => {
    // const { getByText } = render(
    //   <Editor
    //     document={document}
    //     onChange={jest.fn()}
    //     plugins={[TestPluging]}
    //   />,
    // );
    // getByText('test-element');
  });
});
