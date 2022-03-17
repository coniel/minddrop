import { serializeResouceDocument } from '../serializeResouceDocument';
import { getAllDocs } from '../getAllDocs';
import { ResourceDB } from '../types';
import { DBApi } from '../types';

let executingQueue = false;
const queue: (() => Promise<void>)[] = [];

/**
 * Recursively executes action in the queue until
 * all actions have been executed.
 */
function executeSequentially(): void {
  // Set the queue as being executed
  executingQueue = true;

  // Get the next action in the queue
  const nextAction = queue.shift();

  if (!nextAction) {
    // If there are no more actions in the queue,
    // end the execution run.
    executingQueue = false;
    return;
  }

  // Run the action and then start the next execution cycle
  nextAction().then(executeSequentially);
}

/**
 * Adds an action to the queue and starts the
 * queue execution if not already active.
 *
 * @param action The action to add to the queue.
 */
function addToQueue(action: () => Promise<void>) {
  // Add the action to the queue
  queue.push(action);

  if (!executingQueue) {
    // Start queue execution if not already in progress
    executeSequentially();
  }
}
export function initializePouchDB(db: ResourceDB): DBApi {
  return {
    getAllDocs: () => getAllDocs(db),
    add: (type, doc) => {
      addToQueue(async () => {
        db.put(serializeResouceDocument(doc, type));
      });
    },
    update: (id, changes) => {
      addToQueue(async () => {
        const item = await db.get(id);
        await db.put({
          ...item,
          ...changes,
        });
      });
    },
    delete: (id) => {
      addToQueue(async () => {
        const item = await db.get(id);
        await db.put({
          ...item,
          _deleted: true,
        });
      });
    },
  };
}
