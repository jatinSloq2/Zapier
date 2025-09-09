// triggers/newIncomingMessage.js (CommonJS)

const triggerNewIncomingMessage = async (z, bundle) => {
  const response = await z.request({
    method: 'GET',
    url: 'https://aigreentick.com/api/v1/sendMessage',
    params: {
      selectedChannel: bundle.inputData.selectedChannel || undefined,
      chat: '',
      page: bundle.meta.page || 1,
      search: bundle.inputData.search || '',
    },
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
    },
  });

  const users = response.json?.users?.data || [];

  return users
    .filter((user) => user.last_chat && user.last_chat.type === 'recieve')
    .map((user) => ({
      id: user.last_chat.id,
      contact_id: user.id,
      contact_name: user.name,
      contact_mobile: user.mobile,
      message: user.last_chat.text,
      message_type: user.last_chat.method,
      timestamp: user.last_chat.time,
      message_id: user.last_chat.message_id,
      created_at: user.last_chat.created_at,
      sender_name: user.last_chat.send_from_id,
      receiver_name: user.last_chat.send_to_id,
      status: user.last_chat.status,
      is_media: user.last_chat.is_media === '1',
    }));
};

// Optional webhook version (commented out for now)
const triggerNewIncomingMessageHook = async (z, bundle) => {
  const data = bundle.cleanedRequest;

  if (data.type === 'recieve') {
    return [
      {
        id: data.id,
        contact_id: data.contact_id,
        contact_name: data.send_from_id,
        contact_mobile: data.send_from,
        message: data.text,
        message_type: data.method,
        timestamp: data.time,
        message_id: data.message_id,
        created_at: data.created_at,
        sender_name: data.send_from_id,
        receiver_name: data.send_to_id,
        status: data.status,
        is_media: data.is_media === '1',
      },
    ];
  }

  return [];
};

module.exports = {
  key: 'newIncomingMessage',
  noun: 'Message',

  display: {
    label: 'New Incoming Message',
    description: 'Triggers when a new incoming WhatsApp message is received.',
  },

  operation: {
    type: 'polling', // change to 'hook' if you implement webhooks
    perform: triggerNewIncomingMessage,
    // performSubscribe: triggerNewIncomingMessageHook, // For webhooks
    // performUnsubscribe: unsubscribeHook, // For webhooks

    inputFields: [
      {
        key: 'selectedChannel',
        label: 'Channel',
        type: 'string',
        helpText: 'Filter messages by specific channel (optional)',
      },
      {
        key: 'search',
        label: 'Search Term',
        type: 'string',
        helpText: 'Filter messages containing specific text (optional)',
      },
    ],

    sample: {
      id: "17276",
      contact_id: 5535,
      contact_name: 'Shri Balaji Message',
      contact_mobile: '9784690987',
      message: 'Hi',
      message_type: 'text',
      timestamp: '1750764835',
      message_id:
        'wamid.HBgMOTE5Nzg0NjkwOTg3FQIAEhggQUQ0MThCMjc2M0M5QjQ0RDJBNjYzRENFRUI3RTk2MTQA',
      created_at: '2025-06-24T11:33:56.000000Z',
      sender_name: 'Shri Balaji Message',
      receiver_name: 'Ashwin',
      status: 'read',
      is_media: false,
    },

    outputFields: [
      { key: 'id', label: 'Message ID', type: 'string' },
      { key: 'contact_id', label: 'Contact ID', type: 'integer' },
      { key: 'contact_name', label: 'Contact Name', type: 'string' },
      { key: 'contact_mobile', label: 'Contact Mobile', type: 'string' },
      { key: 'message', label: 'Message Text', type: 'string' },
      { key: 'message_type', label: 'Message Type', type: 'string' },
      { key: 'timestamp', label: 'Timestamp', type: 'string' },
      { key: 'message_id', label: 'WhatsApp Message ID', type: 'string' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'sender_name', label: 'Sender Name', type: 'string' },
      { key: 'receiver_name', label: 'Receiver Name', type: 'string' },
      { key: 'status', label: 'Status', type: 'string' },
      { key: 'is_media', label: 'Is Media Message', type: 'boolean' },
    ],
  },
};
