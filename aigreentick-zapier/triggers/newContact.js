// triggers/newContact.js (ES6)

const triggerNewContact = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://aigreentick.com/api/v1/sendMessage',
    params: {
      selectedChannel: bundle.inputData.selectedChannel || null,
      chat: '',
      page: bundle.meta.page || 1,
      search: bundle.inputData.search || '',
    },
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
    },
  });

  const contacts = [];
  if (response.data.users && response.data.users.data) {
    response.data.users.data.forEach((user) => {
      contacts.push({
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        created_at: user.created_at,
        updated_at: user.updated_at,
        total_msg_count: user.total_msg_count,
        last_message_time: user.time,
      });
    });
  }

  return contacts;
};

export default {
  key: 'newContact',
  noun: 'Contact',
  display: {
    label: 'New Contact Created',
    description:
      'Triggers when a new contact is created from an incoming WhatsApp message.',
  },
  operation: {
    type: 'polling',
    perform: triggerNewContact,

    inputFields: [
      {
        key: 'selectedChannel',
        label: 'Channel',
        type: 'string',
        helpText: 'Filter contacts by specific channel (optional)',
      },
    ],

    sample: {
      id: "5535",
      name: 'Shri Balaji Message',
      mobile: '9784690987',
      created_at: '2025-06-24T11:33:56.000000Z',
      updated_at: '2025-06-24T13:15:08.000000Z',
      total_msg_count: 0,
      last_message_time: 1750763849,
    },

    outputFields: [
      { key: 'id', label: 'Contact ID', type: 'string' },
      { key: 'name', label: 'Contact Name', type: 'string' },
      { key: 'mobile', label: 'Mobile Number', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' },
      { key: 'total_msg_count', label: 'Total Message Count', type: 'integer' },
      { key: 'last_message_time', label: 'Last Message Time', type: 'integer' },
    ],
  },
};
