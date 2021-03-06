import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup, core } from '../test-utils';
import { onCreate } from './onCreate';

const { tSixDrops, tTwoDrops, tNoDrops } = TOPICS_TEST_DATA;

describe('onCreate', () => {
  beforeEach(() => {
    setup();
  });

  afterEach(cleanup);

  it("spreads the topic's drops evenly between the columns when drops count > columns count", () => {
    const data = onCreate(core, tSixDrops);

    expect(data.columns[0].items.length).toBe(2);
    expect(data.columns[1].items.length).toBe(2);
    expect(data.columns[2].items.length).toBe(2);
  });

  it("spreads the topic's drops between the first columns when drops count < columns count", () => {
    const data = onCreate(core, tTwoDrops);

    expect(data.columns[0].items.length).toBe(1);
    expect(data.columns[1].items.length).toBe(1);
    expect(data.columns[2].items.length).toBe(0);
  });

  it('returns empty columns if topic has no drops', () => {
    const data = onCreate(core, tNoDrops);

    expect(data.columns[0].items).toEqual([]);
    expect(data.columns[1].items).toEqual([]);
    expect(data.columns[2].items).toEqual([]);
  });
});
