import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Recipes database template with translated strings.
 */
export const RecipesDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'recipes');

  // Helper to translate a cuisine option key
  const cuisine = (key: string) =>
    t(`databases.templates.recipes.options.cuisine.${key}`);

  // Helper to translate a diet option key
  const diet = (key: string) =>
    t(`databases.templates.recipes.options.diet.${key}`);

  return {
    ...naming,
    icon: 'content-icon:chef-hat:default',
    properties: [
      {
        type: 'image',
        name: propertyName('image'),
        icon: 'content-icon:image:default',
      },
      {
        type: 'number',
        name: propertyName('prepTime'),
        icon: 'content-icon:timer:default',
      },
      {
        type: 'number',
        name: propertyName('cookTime'),
        icon: 'content-icon:timer:default',
      },
      {
        type: 'number',
        name: propertyName('servings'),
        icon: 'content-icon:utensils:default',
      },
      {
        type: 'select',
        name: propertyName('cuisine'),
        icon: 'content-icon:globe:default',
        options: [
          { value: cuisine('italian'), color: 'green' },
          { value: cuisine('mexican'), color: 'red' },
          { value: cuisine('chinese'), color: 'orange' },
          { value: cuisine('indian'), color: 'yellow' },
          { value: cuisine('japanese'), color: 'pink' },
          { value: cuisine('french'), color: 'blue' },
          { value: cuisine('thai'), color: 'purple' },
          { value: cuisine('mediterranean'), color: 'cyan' },
          { value: cuisine('american'), color: 'brown' },
        ],
      },
      {
        type: 'select',
        name: propertyName('diet'),
        icon: 'content-icon:leaf:default',
        options: [
          { value: diet('vegetarian'), color: 'green' },
          { value: diet('vegan'), color: 'purple' },
          { value: diet('glutenFree'), color: 'yellow' },
          { value: diet('dairyFree'), color: 'blue' },
        ],
      },
      {
        type: 'formatted-text',
        name: propertyName('ingredients'),
        icon: 'content-icon:list:default',
      },
      {
        type: 'formatted-text',
        name: propertyName('instructions'),
        icon: 'content-icon:list-ordered:default',
      },
    ],
  };
};
