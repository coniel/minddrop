import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Expenses database template with translated strings.
 */
export const ExpensesDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.expenses.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.expenses.properties.',
  );

  // Key builder for the category option keys
  const categoryKey = createI18nKeyBuilder(
    'databases.templates.expenses.options.category.',
  );

  // Key builder for the payment method option keys
  const paymentMethodKey = createI18nKeyBuilder(
    'databases.templates.expenses.options.paymentMethod.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:receipt:default',
    properties: [
      {
        type: 'number',
        name: t(propertyKey('amount', 'name')),
        icon: 'content-icon:coins:default',
      },
      {
        type: 'select',
        name: t(propertyKey('category', 'name')),
        icon: 'content-icon:tag:default',
        options: [
          { value: t(categoryKey('food')), color: 'orange' },
          { value: t(categoryKey('transport')), color: 'blue' },
          { value: t(categoryKey('housing')), color: 'brown' },
          { value: t(categoryKey('entertainment')), color: 'pink' },
          { value: t(categoryKey('shopping')), color: 'purple' },
          { value: t(categoryKey('health')), color: 'red' },
          { value: t(categoryKey('utilities')), color: 'yellow' },
          { value: t(categoryKey('education')), color: 'cyan' },
          { value: t(categoryKey('other')), color: 'gray' },
        ],
      },
      {
        type: 'date',
        name: t(propertyKey('date', 'name')),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'select',
        name: t(propertyKey('paymentMethod', 'name')),
        icon: 'content-icon:wallet:default',
        options: [
          { value: t(paymentMethodKey('cash')), color: 'green' },
          { value: t(paymentMethodKey('card')), color: 'blue' },
          { value: t(paymentMethodKey('bankTransfer')), color: 'purple' },
        ],
      },
    ],
  };
};
