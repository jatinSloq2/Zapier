const performSendMessage = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/sendMessage',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      message: bundle.inputData.message,
      recipient_mobile: bundle.inputData.recipient_mobile,
      recipient_name: bundle.inputData.recipient_name || '',
      template_id: null,
      reaction: bundle.inputData.reaction || '',
      isReply: bundle.inputData.isReply || false,
      media_type: '',
      media_url: '',
      filename: '',
      caption: '',
      channel: bundle.inputData.channel,
    },
  });

  return response.data;
};

module.exports = {
  key: 'sendMessage',
  noun: 'Message',
  display: {
    label: 'Send Session Message',
    description: 'Send a WhatsApp message to an open session.',
  },
  operation: {
    perform: performSendMessage,

    inputFields: [
      {
        key: 'recipient_mobile',
        label: 'Recipient Mobile',
        type: 'string',
        required: true,
        helpText: 'Mobile number of the recipient (with country code)',
      },
      {
        key: 'message',
        label: 'Message',
        type: 'text',
        required: true,
        helpText: 'The message text to send',
      },
      {
        key: 'recipient_name',
        label: 'Recipient Name',
        type: 'string',
        required: false,
        helpText: 'Name of the recipient (optional)',
      },
      {
        key: 'channel',
        label: 'Channel',
        type: 'string',
        required: true,
        helpText: 'WhatsApp channel/number to send from',
      },
      {
        key: 'reaction',
        label: 'Reaction',
        type: 'string',
        required: false,
        helpText: 'Reaction emoji (optional)',
      },
      {
        key: 'isReply',
        label: 'Is Reply',
        type: 'boolean',
        required: false,
        helpText: 'Whether this is a reply to another message',
      },
    ],

    sample: {
      success: 'Successfully sent message',
      data: {
        id: 17354,
        user_id: 87,
        text: 'testing',
        send_from: '9314766902',
        send_to: '9784690987',
        send_from_id: 'Ashwin',
        send_to_id: 'Shri Balaji Message',
        type: 'sent',
        message_id:
          'wamid.HBgMOTE5Nzg0NjkwOTg3FQIAERgSQTk3Q0UyQTg3NTcxRDlCNjk3AA==',
        created_at: '2025-06-26T05:07:32.000000Z',
      },
    },

    outputFields: [
      { key: 'success', label: 'Success Message', type: 'string' },
      { key: 'data__id', label: 'Message ID', type: 'integer' },
      { key: 'data__text', label: 'Message Text', type: 'string' },
      { key: 'data__send_from', label: 'Sent From', type: 'string' },
      { key: 'data__send_to', label: 'Sent To', type: 'string' },
      { key: 'data__message_id', label: 'WhatsApp Message ID', type: 'string' },
      { key: 'data__created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
