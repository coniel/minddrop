import React from 'react';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { DropActions } from './DropActions';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { Drop, DropNote, IconButton } from '@minddrop/ui';

const { drop1 } = DROPS_TEST_DATA;
const { tSixDrops } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/DropActions',
  component: DropActions,
};

export const TopicAsParent: React.FC = () => (
  <Drop style={{ maxWidth: 300 }}>
    <DropNote>
      The position of a point particle is defined in relation to a coordinate
      system centred on an arbitrary fixed reference point in space called the
      origin O. A simple coordinate system might describe the position of a
      particle P with a vector notated by an arrow labeled r that points from
      the origin O to point P.
    </DropNote>
    <DropActions
      dropId={drop1.id}
      currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
    />
  </Drop>
);

export const WithCustomActions: React.FC = () => (
  <Drop style={{ maxWidth: 300 }}>
    <DropNote>
      The position of a point particle is defined in relation to a coordinate
      system centred on an arbitrary fixed reference point in space called the
      origin O. A simple coordinate system might describe the position of a
      particle P with a vector notated by an arrow labeled r that points from
      the origin O to point P.
    </DropNote>
    <DropActions
      dropId={drop1.id}
      currentParent={{ resource: 'topics:topic', id: tSixDrops.id }}
    >
      <IconButton icon="expand" label="Open in popup" />
    </DropActions>
  </Drop>
);

export const WithTrashActions: React.FC = () => (
  <Drop style={{ maxWidth: 300 }}>
    <DropNote>
      The position of a point particle is defined in relation to a coordinate
      system centred on an arbitrary fixed reference point in space called the
      origin O. A simple coordinate system might describe the position of a
      particle P with a vector notated by an arrow labeled r that points from
      the origin O to point P.
    </DropNote>
    <DropActions
      dropId={drop1.id}
      currentParent={{ resource: 'app:view', id: 'app:trash' }}
    >
      <IconButton icon="expand" label="Open in popup" />
    </DropActions>
  </Drop>
);
