import { generateRichTextDocument } from '../generateRichTextDocument';
import { toPlainText } from './toPlainText';

describe('toPlainText', () => {
  it('returns a plain text string', () => {
    const document = generateRichTextDocument([
      {
        type: 'paragraph',
        id: 'element-1',
        children: [
          { text: 'Hello ' },
          { text: 'world', bold: true },
          { text: '!' },
        ],
      },
      {
        type: 'paragraph',
        id: 'element-2',
        children: [
          {
            id: 'element-3',
            type: 'link',
            children: [{ text: 'MindDrop website' }],
          },
        ],
      },
    ]);

    expect(toPlainText(document)).toBe('Hello world!\n\nMindDrop website');
  });
});
