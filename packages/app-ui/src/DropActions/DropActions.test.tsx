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

const { drop1 } = DROPS_TEST_DATA;
const { tSixDrops } = TOPICS_TEST_DATA;

describe('<DropActions />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanupRender();
    cleanup();
  });

  const init = (props?: Partial<DropActionsProps>) => {
    const utils = render(
      <div className="drop" data-testid="drop">
        <DropActions dropId={drop1.id} {...props} />
      </div>,
    );

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
        currentParent: { resource: 'topics:topic', id: tSixDrops.id },
      });

      // Should render drop options menu
      const label = i18n.t('dropOptions');
      getByLabelText(label);
    });

    it('renders children', () => {
      // Render with children and a topic as parent
      const { getByText } = init({
        children: <span>CHILD</span>,
        currentParent: { resource: 'topics:topic', id: tSixDrops.id },
      });

      // Should render children
      getByText('CHILD');
    });
  });

  describe('with trash view as parent', () => {
    it('renders the trash view actions', () => {
      // Render with trash view as parent
      const { getByLabelText } = init({
        currentParent: { resource: 'view', id: 'app:trash' },
      });

      // Get a trash action button label
      const deletePermanently = i18n.t('deletePermanently');

      // Should render the trash actions
      getByLabelText(deletePermanently);
    });
  });

  describe('visibility', () => {
    it('is invisible by default', () => {
      const { getByTestId } = init();

      expect(getByTestId('drop-actions')).not.toHaveClass('visible');
    });

    it('stays visible when opening the drop options menu', () => {
      const { getByTestId, getByLabelText } = init({
        currentParent: { resource: 'topics:topic', id: tSixDrops.id },
      });

      act(() => {
        // Click the drop options menu
        const dropOptionsLabel = i18n.t('dropOptions');
        fireEvent.click(getByLabelText(dropOptionsLabel));
      });

      expect(getByTestId('drop-actions')).toHaveClass('visible');
    });

    it('stays visible when opening the drop restore menu', () => {
      const { getByTestId, getByLabelText } = init({
        currentParent: { resource: 'view', id: 'app:trash' },
      });

      act(() => {
        // Click the drop restore button
        const dropOptionsLabel = i18n.t('restore');
        fireEvent.click(getByLabelText(dropOptionsLabel));
      });

      expect(getByTestId('drop-actions')).toHaveClass('visible');
    });
  });
});
