import React from 'react';
import {
  act,
  fireEvent,
  render,
  cleanup as cleanupRender,
} from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DropActions, DropActionsProps } from './DropActions';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { i18n } from '@minddrop/i18n';

const { textDrop1 } = DROPS_TEST_DATA;
const { tSixDrops } = TOPICS_TEST_DATA;

describe('<DropActions />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = (props?: Partial<DropActionsProps>) => {
    const utils = render(<DropActions dropId={textDrop1.id} {...props} />);

    return utils;
  };

  it('renders nothing without a parent', () => {
    const { queryByLabelText, queryByText } = init({
      children: <span>CHILD</span>,
    });

    const dropOptionsLabel = i18n.t('dropOptions');

    // Should not render drop options menu
    expect(queryByLabelText(dropOptionsLabel)).toBeNull();
    // Should not render children
    expect(queryByText('CHILD')).toBeNull();
  });

  describe('with topic as parent', () => {
    it('renders the drop options menu', () => {
      // Render with topic as parent
      const { getByLabelText } = init({
        parent: { type: 'topic', id: tSixDrops.id },
      });

      // Should render drop options menu
      const label = i18n.t('dropOptions');
      getByLabelText(label);
    });

    it('renders children', () => {
      // Render with children and a topic as parent
      const { getByText } = init({
        children: <span>CHILD</span>,
        parent: { type: 'topic', id: tSixDrops.id },
      });

      // Should render children
      getByText('CHILD');
    });
  });

  describe('visibility', () => {
    it('is invisible by default', () => {
      const { getByTestId } = init();

      expect(getByTestId('drop-actions')).not.toHaveClass('visible');
    });

    it('stays visible when opening the drop options menu', () => {
      const { getByTestId } = init();

      act(() => {
        fireEvent.mouseEnter(getByTestId('drop-actions'));
      });

      expect(getByTestId('drop-actions')).toHaveClass('visible');
    });
  });
});
