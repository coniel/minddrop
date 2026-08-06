import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Recipes database template with translated strings.
 */
export const RecipesDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.recipes.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.recipes.properties.',
  );

  // Key builder for the cuisine option keys
  const cuisineKey = createI18nKeyBuilder(
    'databases.templates.recipes.options.cuisine.',
  );

  // Key builder for the diet option keys
  const dietKey = createI18nKeyBuilder(
    'databases.templates.recipes.options.diet.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:chef-hat:default',
    properties: [
      {
        type: 'image',
        name: t(propertyKey('image', 'name')),
        icon: 'content-icon:image:default',
      },
      {
        type: 'number',
        name: t(propertyKey('prepTime', 'name')),
        icon: 'content-icon:timer:default',
      },
      {
        type: 'number',
        name: t(propertyKey('cookTime', 'name')),
        icon: 'content-icon:timer:default',
      },
      {
        type: 'number',
        name: t(propertyKey('servings', 'name')),
        icon: 'content-icon:utensils:default',
      },
      {
        type: 'select',
        name: t(propertyKey('cuisine', 'name')),
        icon: 'content-icon:globe:default',
        options: [
          { value: t(cuisineKey('italian')), color: 'green' },
          { value: t(cuisineKey('mexican')), color: 'red' },
          { value: t(cuisineKey('chinese')), color: 'orange' },
          { value: t(cuisineKey('indian')), color: 'yellow' },
          { value: t(cuisineKey('japanese')), color: 'pink' },
          { value: t(cuisineKey('french')), color: 'blue' },
          { value: t(cuisineKey('thai')), color: 'purple' },
          { value: t(cuisineKey('mediterranean')), color: 'cyan' },
          { value: t(cuisineKey('american')), color: 'brown' },
        ],
      },
      {
        type: 'select',
        name: t(propertyKey('diet', 'name')),
        icon: 'content-icon:leaf:default',
        options: [
          { value: t(dietKey('vegetarian')), color: 'green' },
          { value: t(dietKey('vegan')), color: 'purple' },
          { value: t(dietKey('glutenFree')), color: 'yellow' },
          { value: t(dietKey('dairyFree')), color: 'blue' },
        ],
      },
      {
        type: 'formatted-text',
        name: t(propertyKey('ingredients', 'name')),
        icon: 'content-icon:list:default',
      },
      {
        type: 'formatted-text',
        name: t(propertyKey('instructions', 'name')),
        icon: 'content-icon:list-ordered:default',
      },
    ],
  };
};
