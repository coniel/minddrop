import { extractOpenGraph } from '@devmehq/open-graph-extractor';
import axios from 'axios';
import { getWebpageMetadata } from './getWebpageMetadata';

jest.mock('axios', () => ({
  get: jest.fn().mockReturnValue({ data: 'HTML' }),
}));

jest.mock('@devmehq/open-graph-extractor', () => ({
  extractOpenGraph: jest.fn().mockReturnValue({
    ogTitle: 'IB Guides',
    ogDescription: 'OG description',
    description: 'Description',
  }),
}));

describe('getWebpageMetadata', () => {
  it('gets the webpage HTML', () => {
    // Get metadata for a URL
    getWebpageMetadata('https://ibguides.com');

    // Should call 'axios.get' with the URL
    expect(axios.get).toHaveBeenCalledWith(
      'https://ibguides.com',
      // Options passes to the call
      expect.anything(),
    );
  });

  it('calls extractOpenGraph with the webpage data', () => {
    // Get metadata for a URL
    getWebpageMetadata('https://ibguides.com');

    // Should call getMetadata with the URL
    expect(extractOpenGraph).toHaveBeenCalledWith(
      'HTML',
      // Options passes to the call
      expect.anything(),
    );
  });

  it('returns the metadata', async () => {
    // Get metadata for a URL
    const metadata = await getWebpageMetadata('https://ibguides.com');

    // Should return metadata
    expect(metadata).toEqual({
      domain: 'ibguides.com',
      title: 'IB Guides',
      // Should default to description over ogDescription
      description: 'Description',
    });
  });
});
