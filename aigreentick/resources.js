const getTemplates = {
  key: 'getTemplates',
  noun: 'Template',

  list: {
    display: {
      label: 'List Templates',
      description: 'Fetches all approved templates from Aigreentick.',
    },
    operation: {
      perform: async (z, bundle) => {
        const response = await z.request({
          method: 'GET',
          url: 'https://aigreentick.com/api/v1/wa-templates?type=list',
          headers: { Authorization: `Bearer ${bundle.authData.api_token}` },
        });

        const templates = response.json?.data || [];
        return templates.map((t) => ({
          id: String(t.id),
          name: t.name,
          language: t.language,
          status: t.status,
        }));
      },
      sample: {
        id: '1348',
        name: 'ash_quickbook',
        language: 'en',
        status: 'APPROVED',
      },
      outputFields: [
        { key: 'id', label: 'Template ID', type: 'string' },
        { key: 'name', label: 'Template Name', type: 'string' },
        { key: 'language', label: 'Language', type: 'string' },
        { key: 'status', label: 'Status', type: 'string' },
      ],
    },
  },
};

const getCountries = {
  key: 'getCountries',
  noun: 'Country',
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
