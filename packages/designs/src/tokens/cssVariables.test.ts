import { existsSync, readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { describe, expect, it } from 'vitest';
import { BorderColorTokens } from './borderColor';
import { BorderWidthTokens } from './borderWidth';
import { TokenGroup, tokenCssVariable } from './cssVariables';
import { FontFamilyTokens } from './fontFamily';
import { FontSizeTokens } from './fontSize';
import { FontWeightTokens } from './fontWeight';
import { IconSizeTokens } from './iconSize';
import { LetterSpacingTokens } from './letterSpacing';
import { LineHeightTokens } from './lineHeight';
import { MeasureTokens } from './measure';
import { RadiusTokens } from './radius';
import { ShadowTokens } from './shadow';
import { SizeTokens } from './size';
import { SpaceTokens } from './space';
import { SurfaceColorTokens } from './surfaceColor';
import { TextColorTokens } from './textColor';

// Every token group paired with its member list
const tokenGroups: Record<TokenGroup, readonly string[]> = {
  fontFamily: FontFamilyTokens,
  fontSize: FontSizeTokens,
  fontWeight: FontWeightTokens,
  lineHeight: LineHeightTokens,
  letterSpacing: LetterSpacingTokens,
  measure: MeasureTokens,
  space: SpaceTokens,
  size: SizeTokens,
  radius: RadiusTokens,
  borderWidth: BorderWidthTokens,
  iconSize: IconSizeTokens,
  shadow: ShadowTokens,
  textColor: TextColorTokens,
  surfaceColor: SurfaceColorTokens,
  borderColor: BorderColorTokens,
};

// Walk up from the working directory to the workspace root
let workspaceRoot = process.cwd();

while (!existsSync(join(workspaceRoot, 'pnpm-workspace.yaml'))) {
  workspaceRoot = dirname(workspaceRoot);
}

// The theme's token CSS concatenated, read from the ui/theme package
// so the unions are guarded against drifting from the real vocabulary
const themeTokensDir = join(workspaceRoot, 'ui/theme/src/tokens');
const themeTokensCss = readdirSync(themeTokensDir)
  .filter((file) => file.endsWith('.css'))
  .map((file) => readFileSync(`${themeTokensDir}/${file}`, 'utf8'))
  .join('\n');

describe('tokenCssVariable', () => {
  it('resolves a token to its CSS custom property reference', () => {
    expect(tokenCssVariable('fontSize', 'md')).toBe('var(--font-size-md)');
  });

  it('applies the irregular font family prefix', () => {
    expect(tokenCssVariable('fontFamily', 'sans')).toBe('var(--font-sans)');
  });

  it.each(Object.entries(tokenGroups))(
    'every %s token resolves to a custom property defined by the theme',
    (group, tokens) => {
      tokens.forEach((token) => {
        // Extract the custom property name from the var() reference
        const variable = tokenCssVariable(group as TokenGroup, token).slice(
          4,
          -1,
        );

        // The property must be declared in the theme's token files
        expect(themeTokensCss).toMatch(new RegExp(`${variable}:`));
      });
    },
  );
});
