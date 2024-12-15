import { afterEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { cleanup, render } from '@minddrop/test-utils';
import { TopicDrop } from './TopicDrop';

describe('<TopicDrop />', () => {
  afterEach(cleanup);

  it('renders the className', () => {
    const { getByText } = render(
      <TopicDrop label="Topic" className="my-class" />,
    );

    expect(getByText('Topic').className).toContain('my-class');
  });

  it('renders the label', () => {
    const { getByText } = render(
      <TopicDrop label="Topic" className="my-class" />,
    );

    getByText('Topic');
  });

  it('renders the `Untitled` if the label is falsy', () => {
    const { getByText } = render(<TopicDrop label="" className="my-class" />);

    // Get the 'Untitled' label
    const label = i18n.t('untitled');

    // Should render 'Untitled'
    getByText(label);
  });

  it('renders children', () => {
    const { getByText } = render(
      <TopicDrop label="Topic" className="my-class">
        <span>child</span>
      </TopicDrop>,
    );

    getByText('child');
  });
});
