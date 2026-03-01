import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Expenses database template with translated strings.
 */
export const ExpensesDatabaseTemplate: DatabaseTemplateFn = (
  t: TranslateFn,
) => {
  const { naming, propertyName } = createI18n(t, 'expenses');

  // Helper to translate a category option key
  const category = (key: string) =>
    t(`databases.templates.expenses.options.category.${key}`);

  // Helper to translate a payment method option key
  const paymentMethod = (key: string) =>
    t(`databases.templates.expenses.options.paymentMethod.${key}`);

  return {
    ...naming,
    icon: 'content-icon:receipt:default',
    properties: [
      {
        type: 'number',
        name: propertyName('amount'),
        icon: 'content-icon:coins:default',
      },
      {
        type: 'select',
        name: propertyName('category'),
        icon: 'content-icon:tag:default',
        options: [
          { value: category('food'), color: 'orange' },
          { value: category('transport'), color: 'blue' },
          { value: category('housing'), color: 'brown' },
          { value: category('entertainment'), color: 'pink' },
          { value: category('shopping'), color: 'purple' },
          { value: category('health'), color: 'red' },
          { value: category('utilities'), color: 'yellow' },
          { value: category('education'), color: 'cyan' },
          { value: category('other'), color: 'gray' },
        ],
      },
      {
        type: 'date',
        name: propertyName('date'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'select',
        name: propertyName('paymentMethod'),
        icon: 'content-icon:wallet:default',
        options: [
          { value: paymentMethod('cash'), color: 'green' },
          { value: paymentMethod('card'), color: 'blue' },
          { value: paymentMethod('bankTransfer'), color: 'purple' },
        ],
      },
    ],
  };
};
