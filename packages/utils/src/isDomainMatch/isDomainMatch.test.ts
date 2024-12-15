import { describe, expect, it } from 'vitest';
import { isDomainMatch } from './isDomainMatch';

describe('isDomainMatch', () => {
  describe('subdomain', () => {
    describe('url without subdomain', () => {
      it('returns true if the domain and TLD match', () => {
        // Test a domain and TLD matcher
        const result = isDomainMatch('https://minddrop.app', ['minddrop.app']);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('returns false if the matcher has a subdomain', () => {
        // Test a matcher with a subdomain
        const result = isDomainMatch('https://minddrop.app', [
          'docs.minddrop.app',
        ]);

        // Should return `false`
        expect(result).toBe(false);
      });

      it('returns false if the matcher has a wildcard subdomain', () => {
        // Test a matcher with a wildcard subdomain
        const result = isDomainMatch('https://minddrop.app', [
          '*.minddrop.app',
        ]);

        // Should return `false`
        expect(result).toBe(false);
      });
    });

    describe('url with subdomain', () => {
      it('returns true if the domain, TLD, and subdomain match', () => {
        // Test a domain, TLD, and subdomain matcher
        const result = isDomainMatch('https://docs.minddrop.app', [
          'docs.minddrop.app',
        ]);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('returns true if the domain and TLD match and subdomain is a wildcard', () => {
        // Test a domain, TLD, and subdomain matcher with a wildcard
        // subdomain matcher.
        const result = isDomainMatch('https://docs.minddrop.app', [
          '*.minddrop.app',
        ]);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('returns false if the matcher has no subdomain', () => {
        // Test a matcher without a subdomain
        const result = isDomainMatch('https://docs.minddrop.app', [
          'minddrop.app',
        ]);

        // Should return `false`
        expect(result).toBe(false);
      });
    });

    describe('www', () => {
      it('ignores URL www subdomain if matcher has no subdomain', () => {
        // Test a URL with 'www' as its subdomain against a matcher
        // which has no subdomain.
        const result = isDomainMatch('https://www.minddrop.app', [
          'minddrop.app',
        ]);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('does not ignore URL www subdomain if matcher has a subdomain', () => {
        // Test a URL with 'www' as its subdomain against a matcher
        // which has a non 'www' subdomain.
        const result = isDomainMatch('https://www.minddrop.app', [
          'docs.minddrop.app',
        ]);

        // Should return `false`
        expect(result).toBe(false);
      });

      it('returns true if matcher subdomain is www', () => {
        // Test a URL with 'www' as its subdomain against a matcher
        // which has 'www' as its subdomain.
        const result = isDomainMatch('https://www.minddrop.app', [
          'www.minddrop.app',
        ]);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('returns true if matcher subdomain is a wildcard', () => {
        // Test a URL with 'www' as its subdomain against a matcher
        // which has a wildcard subdomain.
        const result = isDomainMatch('https://www.minddrop.app', [
          '*.minddrop.app',
        ]);

        // Should return `true`
        expect(result).toBe(true);
      });
    });
  });

  describe('TLD', () => {
    describe('with TLD', () => {
      it('returns false if the TLD does not match', () => {
        // Test a matcher with a TLD which does not match
        // the domain's TLD.
        const result = isDomainMatch('https://minddrop.app', ['minddrop.com']);

        // Should return `false`
        expect(result).toBe(false);
      });

      it('returns true if the TLD matches', () => {
        // Test a matcher with a TLD which matches the
        // domain's TLD.
        const result = isDomainMatch('https://minddrop.app', ['minddrop.app']);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('returns true if the TLD is a wildcard', () => {
        // Test a matcher with a wildcard TLD
        const result = isDomainMatch('https://minddrop.app', ['minddrop.*']);

        // Should return `true`
        expect(result).toBe(true);
      });
    });

    describe('without TLD', () => {
      it('returns true if the matcher has no TLD', () => {
        // Test a matcher without a TLD
        const result = isDomainMatch('http://127.0.0.1', ['127.0.0.1']);

        // Should return `true`
        expect(result).toBe(true);
      });

      it('returns false if the matcher TLD is a wildcard', () => {
        // Test a URL without a TLD using a matcher with a wildcard TLD
        const result = isDomainMatch('http://127.0 0.1', ['127.0 0.1.*']);

        // Should return `false`
        expect(result).toBe(false);
      });
    });

    it('supports ports', () => {
      // Test a matcher without a TLD
      const result = isDomainMatch('http://localhost:3000', ['localhost:3000']);

      // Should return `true`
      expect(result).toBe(true);
    });
  });

  it('works with wildcard subdomain and TLD combined', () => {
    // Test a matcher with a wildcard subdomain and TLD
    const result = isDomainMatch('https://docs.minddrop.app', ['*.minddrop.*']);

    // Should return `true`
    expect(result).toBe(true);
  });

  it('returns true if any of the matchers pass', () => {
    // Test a matcher with multiple matchers of which only
    // a single one passes.
    const result = isDomainMatch('https://docs.minddrop.app', [
      'ibguides.com',
      'docs.minddrop.app',
      'minddrop.site',
    ]);

    // Should return `true`
    expect(result).toBe(true);
  });

  describe('matcher function', () => {
    it('returns true if the matcher function returns true', () => {
      // Test a matcher function which returns true
      const result = isDomainMatch('https://minddrop.app', [() => true]);

      // Should return `true`
      expect(result).toBe(true);
    });

    it('returns false if the matcher function returns false', () => {
      // Test a matcher function which returns false
      const result = isDomainMatch('https://minddrop.app', [() => false]);

      // Should return `false`
      expect(result).toBe(false);
    });
  });

  it('returns true if any matcher matches', () => {
    // Test a matcher function which returns false along
    // with a string matcher that matches.
    const result1 = isDomainMatch('https://minddrop.app', [
      'minddrop.app',
      () => false,
    ]);
    // Test a matcher function which returns true along
    // with a string matcher that does not match.
    const result2 = isDomainMatch('https://minddrop.app', [
      'minddrop.site',
      () => true,
    ]);

    // Should both return `true`
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it('returns true if the matcher is a wildcard', () => {
    // Test a wildcard matcher
    const result = isDomainMatch('https://minddrop.app', ['*']);

    // Should return `true`
    expect(result).toBe(true);
  });

  it('returns false if `url` is not a URL', () => {
    // Test with a non URL value as the `url` parameter
    const result = isDomainMatch('not a url', ['*']);

    // Should return `false`
    expect(result).toBe(false);
  });
});
