const performBroadcastMessage = async (z, bundle) => {
  // Parse mobile numbers
  let mobile_numbers;
  if (typeof bundle.inputData.mobile_numbers === 'string') {
    mobile_numbers = bundle.inputData.mobile_numbers
      .split(',')
      .map((num) => num.trim())
      .filter((num) => num.length > 0);
  } else {
    mobile_numbers = bundle.inputData.mobile_numbers || [];
  }

  // Fetch template details
  const templateResp = await z.request({
    method: 'GET',
    url: `https://aigreentick.com/api/v1/templates/${bundle.inputData.template_id}`,
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
    },
  });

  const template = templateResp.json || {};
  let is_media = false;
  let media_type = '';
  let media_url = '';

  // Detect media from template components
  if (template.components && Array.isArray(template.components)) {
    const header = template.components.find(c => c.type === 'HEADER');
    if (header) {
      if (header.format === 'IMAGE' && header.image_url) {
        is_media = true;
        media_type = 'IMAGE';
        media_url = header.image_url;
      } else if (header.format === 'VIDEO' && header.video_url) {
        is_media = true;
        media_type = 'VIDEO';
        media_url = header.video_url;
      } else if (header.format === 'DOCUMENT' && header.document_url) {
        is_media = true;
        media_type = 'DOCUMENT';
        media_url = header.document_url;
      }
    }
  }

  // Allow user override if provided in Zap input
  if (bundle.inputData.media_type) media_type = bundle.inputData.media_type;
  if (bundle.inputData.media_url) media_url = bundle.inputData.media_url;
  if (media_type && media_url) is_media = true;

  // Inject country_id from auth if not provided manually
  const country_id = bundle.authData.country_id;

  // Build request payload
  const body = {
    template_id: bundle.inputData.template_id,
    country_id,
    camp_name: bundle.inputData.camp_name || 'Default Campaign',
    mobile_numbers,
    is_media,
    media_type,
    media_url,
    schedule_date: bundle.inputData.schedule_date || '',
    variables: bundle.inputData.variables || '',
  };

  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/broadcast',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = response.json;

  return {
    ...result,
    is_media,
    media_type,
    media_url,
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
  performBroadcastMessage,
  broadcastMessage,
};