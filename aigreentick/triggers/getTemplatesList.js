const { z } = require('zapier-platform-core');

const getTemplatesList = {
  key: 'getTemplatesList',
  noun: 'Template',
  display: {
    label: 'Get Templates',
    description: 'Triggers when a template is retrieved',
  },
  operation: {
    perform: async (z) => {
      return []; // empty array
    },
    sample: {
      id: 1,
      name: 'Dummy Template',
      created_at: new Date().toISOString(),
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'created_at', label: 'Created At' },
    ],
  },
};

module.exports = getTemplatesList;