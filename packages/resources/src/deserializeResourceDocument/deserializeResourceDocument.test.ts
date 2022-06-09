import { setup, cleanup, core } from '../test-utils';
import { ResourceDeserializers } from '../types';
import { createResource } from '../createResource';
import { registerResource } from '../registerResource';
import { generateResourceDocument } from '../generateResourceDocument';
import { deserializeResourceDocument } from './deserializeResourceDocument';

interface Data {
  date: Date;
  object: {
    date: Date;
  };
  dateArray: Date[];
  objectArray: { date: Date }[];
}

const resource = createResource<Data, {}, {}>({
  resource: 'tests:resource',
  dataSchema: {
    date: {
      type: 'date',
    },
    object: {
      type: 'object',
      schema: {
        date: {
          type: 'date',
        },
      },
    },
    dateArray: {
      type: 'array',
      items: {
        type: 'date',
      },
    },
    objectArray: {
      type: 'array',
      items: {
        type: 'object',
        schema: {
          date: {
            type: 'date',
          },
        },
      },
    },
  },
});

const document = generateResourceDocument('tests:resource', {
  date: new Date().toISOString(),
  object: {
    date: new Date().toISOString(),
  },
  dateArray: [new Date().toISOString()],
  objectArray: [{ date: new Date().toISOString() }],
  multiType: new Date().toISOString(),
  multiTypeObject: {
    date: new Date().toISOString(),
  },
  multiTypeArray: [
    new Date().toISOString(),
    { date: new Date().toISOString() },
    [new Date().toISOString()],
  ],
});

const deserializers: ResourceDeserializers = {
  date: () => new Date(),
};

describe('deserializeResourceDocument', () => {
  beforeEach(() => {
    setup();

    // Register the test resource type
    registerResource(core, resource);
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('deserializes root values', () => {
    // Deserialize a document with a date at the root level
    const deserialized = deserializeResourceDocument<Data>(
      document,
      deserializers,
    );

    // Should deserialize the date
    expect(deserialized.date).toBeInstanceOf(Date);
  });

  it('deserializes fields inside object values', () => {
    // Deserialize a document with a date inside an object field
    const deserialized = deserializeResourceDocument<Data>(
      document,
      deserializers,
    );

    // Should deserialize the nested date
    expect(deserialized.object.date).toBeInstanceOf(Date);
  });

  it('deserializes array values', () => {
    // Deserialize a document with an array of dates
    const deserialized = deserializeResourceDocument<Data>(
      document,
      deserializers,
    );

    // Deserializes the date inside the array
    expect(deserialized.dateArray[0]).toBeInstanceOf(Date);
  });

  it('deserializes array object values', () => {
    // Deserialize a document with an array of objects
    // containing a date.
    const deserialized = deserializeResourceDocument<Data>(
      document,
      deserializers,
    );

    // Deserializes the date inside the object
    expect(deserialized.objectArray[0].date).toBeInstanceOf(Date);
  });
});
