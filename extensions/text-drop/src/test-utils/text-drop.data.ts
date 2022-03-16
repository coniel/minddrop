import { generateDrop } from '@minddrop/drops';
import { TextDrop } from '../types';

export const textDrop1: TextDrop = generateDrop({
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Position and its derivatives' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'The position of a point particle is defined in relation to a coordinate system centred on an arbitrary fixed reference point in space called the origin O. A simple coordinate system might describe the position of a particle P with a vector notated by an arrow labeled r that points from the origin O to point P.',
        },
      ],
    },
  ]),
});

export const textDrop2: TextDrop = generateDrop({
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Classical mechanics' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Classical mechanics is a physical theory describing the motion of macroscopic objects, from parts of machinery to stars and galaxies.',
        },
      ],
    },
  ]),
});

export const textDrop3: TextDrop = generateDrop({
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Law of inertia' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'An object at rest remains at rest, and an object that is moving will continue to move straight and with constant velocity, if and only if there is no net force acting on that object.',
        },
      ],
    },
  ]),
});

export const textDrop4: TextDrop = generateDrop({
  type: 'text',
  contentRevision: 'rev-1',
  content: JSON.stringify([
    { type: 'title', children: [{ text: 'Acceleration' }] },
    {
      type: 'paragraph',
      children: [
        {
          text: 'The acceleration, or rate of change of velocity, is the derivative of the velocity with respect to time.',
        },
      ],
    },
  ]),
});
