const words = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'ad',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'ex',
  'ea',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'qui',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
];

/**
 * Generates random lorem ipsum style text of the given word count.
 * The first letter is capitalized.
 *
 * @param wordCount - The number of words to generate.
 * @returns The generated text.
 */
export function generateLoremIpsum(wordCount: number): string {
  const result: string[] = [];

  for (let index = 0; index < wordCount; index++) {
    const randomIndex = Math.floor(Math.random() * words.length);

    result.push(words[randomIndex]);
  }

  const text = result.join(' ');

  return text.charAt(0).toUpperCase() + text.slice(1);
}
