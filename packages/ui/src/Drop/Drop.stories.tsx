import React from 'react';
import { Drop } from './Drop';
import { DropTitle } from './DropTitle';
import { DropNote } from './DropNote';

export default {
  title: 'ui/Drop',
  component: Drop,
};

export const Default: React.FC = () => (
  <div style={{ display: 'flex', columnGap: 32, rowGap: 32, flexWrap: 'wrap' }}>
    <Drop style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="blue" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="cyan" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="red" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="pink" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="purple" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="green" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="yellow" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="orange" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="brown" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop color="gray" style={{ width: 240 }}>
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

export const Selected: React.FC = () => (
  <div style={{ display: 'flex', columnGap: 32, rowGap: 32, flexWrap: 'wrap' }}>
    <Drop className="drop-selected" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="blue" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="cyan" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="red" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="pink" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="purple" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="green" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="yellow" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="orange" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="brown" style={{ width: 240 }}>
      <DropTitle>Reference frames</DropTitle>
      <DropNote>
        Reference frames play a crucial role in relativity theory. The term
        reference frame as used here is an observational perspective in space
        that is not undergoing any change in motion (acceleration), from which a
        position can be measured along 3 spatial axes (so, at rest or constant
        velocity).
      </DropNote>
    </Drop>
    <Drop className="drop-selected" color="gray" style={{ width: 240 }}>
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
