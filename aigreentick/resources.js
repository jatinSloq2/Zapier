// Resources should contain list and hook functions, not perform directly

const getTemplates = {
  key: 'getTemplates',
  noun: 'Template',

  // The list function is used to fetch all items
  list: {
    display: {
      label: 'List Templates',
      description: 'Triggers when searching for templates.',
    },
    operation: {
      perform: async (z, bundle) => {
        const response = await z.request({
          method: 'GET',
          url: 'https://aigreentick.com/api/v1/wa-templates',
          headers: { Authorization: `Bearer ${bundle.authData.api_token}` },
        });

        return response.data.data.data.map((t) => ({
          id: t.id,
          name: `${t.name} (${t.language}) - ${t.status}`,
        }));
      },
      sample: { id: '1', name: 'Sample Template' },
      outputFields: [
        { key: 'id', label: 'Template ID', type: 'string' },
        { key: 'name', label: 'Template Name', type: 'string' },
      ],
    },
  },
};

const getCountries = {
  key: 'getCountries',
  noun: 'Country',

  // The list function is used to fetch all items
  list: {
    display: {
      label: 'List Countries',
      description: 'Triggers when countries are available.',
    },
    operation: {
      perform: async () => [
        { id: '98', name: 'India' },
        { id: '1', name: 'USA' },
      ],
      sample: { id: '98', name: 'India' },
      outputFields: [
        { key: 'id', label: 'Country ID', type: 'string' },
        { key: 'name', label: 'Country Name', type: 'string' },
      ],
    },
  },
};

module.exports = {
  getTemplates,
  getCountries,
};
