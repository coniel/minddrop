import { Application } from 'spectron';
import path from 'path';

const app = new Application({
  path: path.join(
    __dirname,
    '../out/MindDrop-darwin-x64/MindDrop.app/Contents/MacOS/MindDrop',
  ),
  args: [path.join(__dirname, '../.webpack')],
});

describe('App', () => {
  beforeEach(async () => {
    await app.start();
  });

  afterEach(async () => {
    if (app && app.isRunning()) await app.stop();
  });

  it('should launch app', async () => {
    const isVisible = await app.browserWindow.isVisible();
    expect(isVisible).toBe(true);
  });
});
