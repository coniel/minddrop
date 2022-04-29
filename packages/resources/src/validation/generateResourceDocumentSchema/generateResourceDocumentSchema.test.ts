import { ResourceDocumentDataSchema } from '../../types';
import { generateResourceDocumentSchema } from './generateResourceDocumentSchema';

interface Data {
  foo: string;
}

const dataSchema: ResourceDocumentDataSchema<Data> = {
  foo: { type: 'string' },
};

describe('generateResourceDocumentSchema', () => {
  it('returns a schema containing default field validators and data field validators', () => {
    // Generate a schema
    const schema = generateResourceDocumentSchema<Data>(dataSchema);

    // Returned schema should contain default field validators
    expect(schema.id).toBeDefined();
    // Returned schema should contain data field validators
    expect(schema.foo).toBeDefined();
  });
});
