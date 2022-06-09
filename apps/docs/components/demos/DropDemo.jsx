import React from 'react';
import { Drop, DropTitle, DropNote } from '@minddrop/ui';

export const DropDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Drop style={{ width: 300 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
  </div>
);

export default DropDemo;
