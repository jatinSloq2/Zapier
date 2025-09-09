export const getTemplates = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://aigreentick.com/api/v1/wa-templates',
    params: { type: 'get', page: 1 },
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
    },
  });

  return response.data.data.data.map(template => ({
    id: template.id,
    name: `${template.name} (${template.language}) - ${template.status}`,
    value: template.id,
  }));
};

export const performSendTemplateMessage = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/broadcast',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      template_id: bundle.inputData.template_id,
      country_id: bundle.inputData.country_id || '98',
      camp_name: bundle.inputData.camp_name || 'Default Campaign',
      mobile_numbers: [bundle.inputData.recipient_mobile],
      is_media: bundle.inputData.is_media === 'true',
      media_type: bundle.inputData.media_type || '',
      media_url: bundle.inputData.media_url || 'https://example.com/media.jpg',
      schedule_date: bundle.inputData.schedule_date || '',
      variables: bundle.inputData.variables || '',
    },
  });

  return response.data;
};

export default {
  key: 'sendTemplateMessage',
  noun: 'Template Message',
  display: {
    label: 'Send Template Message',
    description: 'Send an approved template WhatsApp message.',
  },
  operation: {
    perform: performSendTemplateMessage,
    inputFields: [
      {
        key: 'recipient_mobile',
        label: 'Recipient Mobile',
        type: 'string',
        required: true,
        helpText: 'Mobile number of the recipient (with country code)',
      },
      {
        key: 'template_id',
        label: 'Template',
        type: 'string',
        required: true,
        dynamic: 'getTemplates.id.name',
        helpText: 'Select the approved template to send',
      },
      {
        key: 'variables',
        label: 'Template Variables',
        type: 'string',
        required: false,
        default: 'N/A',
        helpText: 'Comma-separated values for template variables (e.g., "John,Doe,123")',
      },
      {
        key: 'country_id',
        label: 'Country ID',
        type: 'string',
        required: false,
        dynamic: 'getCountries.id.name',
        default: '98',
        helpText: 'Country ID (default: 98 for India)',
      },
      {
        key: 'camp_name',
        label: 'Campaign Name',
        type: 'string',
        required: false,
        default: 'Default Campaign',
        helpText: 'Name for this campaign (optional)',
      },
      {
        key: 'is_media',
        label: 'Include Media',
        type: 'boolean',
        required: false,
        default: "false",
        helpText: 'Whether to include media with the template',
      },
      {
        key: 'media_type',
        label: 'Media Type',
        type: 'string',
        required: false,
        choices: ['IMAGE', 'VIDEO', 'DOCUMENT'],
        helpText: 'Type of media to include (if any)',
      },
      {
        key: 'media_url',
        label: 'Media URL',
        type: 'string',
        required: false,
        default: 'https://example.com/media.jpg',
        helpText: 'URL of the media to include',
      },
      {
        key: 'schedule_date',
        label: 'Schedule Date',
        type: 'datetime',
        required: false,
      },
    ],
    sample: { success: 'Broadcast queued successfully.' },
    outputFields: [{ key: 'success', label: 'Success Message', type: 'string' }],
  },
};
