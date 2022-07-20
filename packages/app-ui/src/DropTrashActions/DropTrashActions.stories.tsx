import React from 'react';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { DropTrashActions } from './DropTrashActions';

const { drop1 } = DROPS_TEST_DATA;

export default {
  title: 'app-ui/DropTrashActions',
  component: DropTrashActions,
};

export const Default: React.FC = () => <DropTrashActions dropId={drop1.id} />;
