// Simple searches for dropdown functionality - no resources needed

const templatesSearch = {
  key: 'templates',
  noun: 'Template',
  display: {
    label: 'Find Template',
    description: 'Triggers when searching for templates.',
  },
  operation: {
    inputFields: [
      {
        key: 'name',
        label: 'Template Name',
        type: 'string',
        helpText: 'Search templates by name',
      },
    ],
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
      { key: 'name', label: 'Template Name' },
    ],
    canPaginate: false,
  },
};

const countriesSearch = {
  key: 'countries',
  noun: 'Country',
  display: {
    label: 'Find Countries',
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
    canPaginate: false,
    inputFields: [
      {
        key: 'name',
        label: 'Country Name',
        type: 'string',
        required: false,
        helpText: 'Search for countries by name (optional)',
      },
    ],
  },
};

module.exports = {
  templatesSearch,
  countriesSearch,
};
