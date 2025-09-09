const getCountries = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://aigreentick.com/api/v1/country',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
    },
  });

  return response.json.success.map((country) => ({
    id: country.id,
    name: `${country.name} (+${country.mobile_code})`,
  }));
};

const performBroadcastMessage = async (z, bundle) => {
  // Parse mobile numbers (can be comma-separated string or array)
  let mobile_numbers;
  if (typeof bundle.inputData.mobile_numbers === 'string') {
    mobile_numbers = bundle.inputData.mobile_numbers
      .split(',')
      .map((num) => num.trim())
      .filter((num) => num.length > 0);
  } else {
    mobile_numbers = bundle.inputData.mobile_numbers || [];
  }

  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/broadcast',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: bundle.inputData.template_id,
      country_id: bundle.inputData.country_id,
      camp_name: bundle.inputData.camp_name || '',
      mobile_numbers,
      is_media: bundle.inputData.is_media || false,
      media_type: bundle.inputData.media_type || '',
      media_url: bundle.inputData.media_url || '',
      schedule_date: bundle.inputData.schedule_date || '',
      variables: bundle.inputData.variables || '',
    }),
  });

  const result = response.json;

  return {
    ...result,
    mobile_numbers_count: mobile_numbers.length,
    mobile_numbers,
  };
};

const broadcastMessage = {
  key: 'broadcastMessage',
  noun: 'Broadcast',
  display: {
    label: 'Send Broadcast Message',
    description: 'Send template messages to multiple recipients at once.'
  },
  operation: {
    perform: performBroadcastMessage,

    inputFields: [
      {
        key: 'template_id',
        label: 'Template',
        type: 'string',
        required: true,
        dynamic: 'getTemplates.id.name',
        helpText: 'Select the approved template to broadcast'
      },
      {
        key: 'mobile_numbers',
        label: 'Mobile Numbers',
        type: 'string',
        required: true,
        helpText: 'Comma-separated list of mobile numbers (with country codes)'
      },
      {
        key: 'country_id',
        label: 'Country',
        type: 'string',
        required: true,
        dynamic: 'getCountries.id.name',
        helpText: 'Select the country for the recipients'
      },
      {
        key: 'variables',
        label: 'Template Variables',
        type: 'string',
        required: false,
        helpText: 'Comma-separated values for template variables'
      },
      {
        key: 'camp_name',
        label: 'Campaign Name',
        type: 'string',
        required: false,
        helpText: 'Name for this broadcast campaign'
      },
      {
        key: 'is_media',
        label: 'Include Media',
        type: 'boolean',
        required: false,
        helpText: 'Whether to include media with the template'
      },
      {
        key: 'media_type',
        label: 'Media Type',
        type: 'string',
        required: false,
        choices: ['IMAGE', 'VIDEO', 'DOCUMENT'],
        helpText: 'Type of media to include'
      },
      {
        key: 'media_url',
        label: 'Media URL',
        type: 'string',
        required: false,
        helpText: 'URL of the media to include'
      },
      {
        key: 'schedule_date',
        label: 'Schedule Date',
        type: 'datetime',
        required: false,
        helpText: 'Schedule the broadcast for later'
      }
    ],

    sample: {
      success: 'Broadcast queued successfully.',
      mobile_numbers_count: 1,
      mobile_numbers: ['9799605400']
    },

    outputFields: [
      { key: 'success', label: 'Success Message', type: 'string' },
      { key: 'mobile_numbers_count', label: 'Recipients Count', type: 'integer' },
      { key: 'mobile_numbers[]', label: 'Mobile Numbers' }
    ]
  }
};

module.exports = {
  getCountries,
  performBroadcastMessage,
  broadcastMessage,
};
