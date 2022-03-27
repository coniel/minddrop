import {
  inlineEquationElement1,
  headingElement1,
  paragraphElement1,
  richTextDocument1PlainText,
  inlineEquationElement1PlainText,
  setup,
  cleanup,
} from '../test-utils';
import { toPlainText } from './toPlainText';

describe('toPlainText', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('converts the children of non void elements to plain text', () => {
    // Convert to plain text
    const plainText = toPlainText([headingElement1, paragraphElement1]);

    // Should match plain text value
    expect(plainText).toBe(richTextDocument1PlainText);
  });

  it('converts void elements with a toPlainText callback to plain text', () => {
    // Convert to plain text
    const plainText = toPlainText([inlineEquationElement1]);

    // Should match plain text value
    expect(plainText).toBe(inlineEquationElement1PlainText);
  });
});
