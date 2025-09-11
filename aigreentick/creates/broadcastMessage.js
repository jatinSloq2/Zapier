// ---------- Helpers ----------
const fetchApi = async (z, url, token) => {
  const resp = await z.request({
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (resp.status !== 200) {
    throw new Error(`Failed request: ${url}, Status: ${resp.status}`);
  }
  return resp.json || {};
};

const parseTemplate = (template) => {
  let preview = '';
  let is_media = false, media_type = '', media_url = '';

  if (!template?.components || !Array.isArray(template.components)) {
    return { preview, is_media, media_type, media_url };
  }

  for (const c of template.components) {
    if (c.type === 'HEADER') {
      if (c.format === 'TEXT') preview += `Header: ${c.text}\n`;
      if (c.format === 'IMAGE' && c.image_url) {
        is_media = true; media_type = 'IMAGE'; media_url = c.image_url;
      }
      if (c.format === 'VIDEO' && c.video_url) {
        is_media = true; media_type = 'VIDEO'; media_url = c.video_url;
      }
      if (c.format === 'DOCUMENT' && c.document_url) {
        is_media = true; media_type = 'DOCUMENT'; media_url = c.document_url;
      }
    }
    if (c.type === 'BODY') preview += `Body: ${c.text}\n`;
    if (c.type === 'FOOTER') preview += `Footer: ${c.text}\n`;
  }

  return { preview, is_media, media_type, media_url };
};

// ---------- Perform ----------
const performBroadcastMessage = async (z, bundle) => {
  const token = bundle.authData.api_token;

  // Fetch dashboard -> country_id
  const dashboard = await fetchApi(z, 'https://aigreentick.com/api/v1/dashboard', token);
  const country_id = dashboard?.data?.user?.country_id;
  if (!country_id) throw new Error('country_id missing. Please verify your account.');

  // Normalize numbers
  const mobile_numbers = (typeof bundle.inputData.mobile_numbers === 'string'
    ? bundle.inputData.mobile_numbers.split(',').map(n => n.trim()).filter(Boolean)
    : bundle.inputData.mobile_numbers) || [];

  z.console.log('Parsed mobile numbers:', mobile_numbers);

  // Fetch template + parse
  const template = await fetchApi(z, `https://aigreentick.com/api/v1/wa-templates/${bundle.inputData.template_id}`, token);
  const { preview: template_preview, is_media, media_type, media_url } = parseTemplate(template);

  // Request body
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

  z.console.log('Broadcast request body:', JSON.stringify(body, null, 2));

  // POST broadcast
  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/broadcast',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return {
    ...response.json,
    is_media,
    media_type,
    media_url,
    mobile_numbers_count: mobile_numbers.length,
    mobile_numbers,
    template_preview,
  };
};

// ---------- Dynamic Template Fields ----------
const dynamicTemplateFields = async (z, bundle) => {
  if (!bundle.inputData.template_id) return [];

  const token = bundle.authData.api_token;
  const template = await fetchApi(z, `https://aigreentick.com/api/v1/wa-templates/${bundle.inputData.template_id}`, token);

  const { preview } = parseTemplate(template);
  const fields = [];

  // Show preview
  if (preview) {
    fields.push({
      key: 'template_preview',
      label: 'Template Preview',
      type: 'text',
      helpText: 'Preview of the selected template',
      default: preview,
    });
  }

  const body = template?.components?.find(c => c.type === 'BODY');
  const matches = body?.text?.match(/{{\d+}}/g) || [];
  matches.forEach((match, i) => {
    fields.push({
      key: `var_${i + 1}`,
      label: `Variable ${i + 1}`,
      type: 'string',
      required: false,
      helpText: `Value for ${match}`,
    });
  });

  return fields;
};

// ---------- Export ----------
const broadcastMessage = {
  key: 'broadcastMessage',
  noun: 'Broadcast',
  display: {
    label: 'Send Broadcast Message',
    description: 'Send template messages to multiple recipients at once.',
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
        helpText: 'Select the approved template to broadcast',
        altersDynamicFields: true,
      },
      dynamicTemplateFields,
      {
        key: 'mobile_numbers',
        label: 'Mobile Numbers',
        type: 'string',
        required: true,
        helpText: 'Comma-separated list of mobile numbers (with country codes)',
      },
      {
        key: 'camp_name',
        label: 'Campaign Name',
        type: 'string',
        required: false,
        helpText: 'Name for this broadcast campaign',
      },
    ],
    sample: {
      success: 'Broadcast queued successfully.',
      mobile_numbers_count: 1,
      mobile_numbers: ['9799605400'],
    },
    outputFields: [
      { key: 'success', label: 'Success Message', type: 'string' },
      { key: 'mobile_numbers_count', label: 'Recipients Count', type: 'integer' },
      { key: 'mobile_numbers[]', label: 'Mobile Numbers' },
      { key: 'template_preview', label: 'Template Preview', type: 'string' },
    ],
  },
};

module.exports = {
  performBroadcastMessage,
  broadcastMessage,
};
