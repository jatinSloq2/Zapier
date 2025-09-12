const performCreateContact = async (z, bundle) => {
  const token = bundle.authData.api_token;

  const body = {
    phone_number: bundle.inputData.phone_number,
    name: bundle.inputData.name,
    allowed_broadcast: bundle.inputData.allowed_broadcast || false,
    allowed_sms: bundle.inputData.allowed_sms || false,
    attributes: {
      city: bundle.inputData.city || '',
      company: bundle.inputData.company || '',
    },
  };

  z.console.log('Create Contact body:', JSON.stringify(body, null, 2));

  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/contacts',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json;
};

const createContact = {
  key: 'createContact',
  noun: 'Contact',
  display: {
    label: 'Create Contact',
    description: 'Create a new contact in Aigreentick.',
  },
  operation: {
    perform: performCreateContact,
    inputFields: [
      { key: 'phone_number', label: 'Phone Number', type: 'string', required: true },
      { key: 'name', label: 'Name', type: 'string', required: true },
      { key: 'allowed_broadcast', label: 'Allow Broadcast', type: 'boolean', required: false },
      { key: 'allowed_sms', label: 'Allow SMS', type: 'boolean', required: false },
      { key: 'city', label: 'City', type: 'string', required: false },
      { key: 'company', label: 'Company', type: 'string', required: false },
    ],
    sample: {
      status: true,
      message: 'Contact created',
    },
    outputFields: [
      { key: 'status', label: 'Status', type: 'boolean' },
      { key: 'message', label: 'Message', type: 'string' },
    ],
  },
};

module.exports = {
  performCreateContact,
  createContact,
};
