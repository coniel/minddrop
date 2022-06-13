import getMetadata from 'metadata-scraper';
import { getWebpageMetadata } from './getWebpageMetadata';

jest.mock('metadata-scraper', () => jest.fn().mockReturnValue('metadata'));

describe('getWebpageMetadata', () => {
  it('calls getMetadata with the URL', () => {
    // Get metadata for a URL
    getWebpageMetadata('https://ibguides.com');

    // Should call getMetadata with the URL
    expect(getMetadata).toHaveBeenCalledWith('https://ibguides.com');
  });

  it('returns a promise resolving to the result of getMetadata', async () => {
    // Get metadata for a URL
    const metadata = await getWebpageMetadata('https://ibguides.com');

    // Should call getMetadata with the URL
    expect(metadata).toBe('metadata');
  });
});
