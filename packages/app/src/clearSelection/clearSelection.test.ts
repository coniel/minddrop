import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { getSelectedDrops } from '../getSelectedDrops';
import { getSelectedTopics } from '../getSelectedTopics';
import { selectDrops } from '../selectDrops';
import { selectTopics } from '../selectTopics';
import { setup, cleanup, core } from '../test-utils';
import { clearSelection } from './clearSelection';

const { drop1 } = DROPS_TEST_DATA;
const { tSailing } = TOPICS_TEST_DATA;

describe('clearSelection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears selected drops and topics', () => {
    selectDrops(core, [drop1.id]);
    selectTopics(core, [tSailing.id]);

    clearSelection(core);

    expect(getSelectedDrops()).toEqual({});
    expect(getSelectedTopics()).toEqual({});
  });

  it('dispatches a `app:selection:clear` event', (done) => {
    core.addEventListener('app:selection:clear', () => {
      done();
    });

    clearSelection(core);
  });
});
