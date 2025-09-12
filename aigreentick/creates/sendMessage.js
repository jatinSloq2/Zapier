const { default: parsePhoneNumberFromString } = require("libphonenumber-js");

const performSendMessage = async (z, bundle) => {
  const token = bundle.authData.api_token;

  // Step 1: Fetch channel automatically
  const channelResp = await z.request({
    url: 'https://aigreentick.com/api/v1/sendMessage',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (channelResp.status !== 200) {
    throw new Error(`Failed to fetch channel: ${channelResp.content}`);
  }

  const channelData = JSON.parse(channelResp.content);
  if (!channelData.channel || !channelData.channel.length) {
    throw new Error('No channel found for this account.');
  }

  // Take first channel for now
  const whatsappNo = channelData.channel[0].whatsapp_no;

  const phoneNumber = parsePhoneNumberFromString(whatsappNo);
  const channel = phoneNumber ? phoneNumber.nationalNumber : whatsappNo;


  const payload = {
    message: bundle.inputData.message || '',
    recipient_mobile: bundle.inputData.recipient_mobile,
    recipient_name: bundle.inputData.recipient_name || '',
    template_id: null,
    reaction: bundle.inputData.reaction || '',
    isReply: bundle.inputData.isReply || false,
    media_type: '',
    media_url: '',
    filename: '',
    caption: bundle.inputData.caption || '',
    channel,
  };

  // Step 3: Send actual WhatsApp message
  const resp = await z.request({
    url: 'https://aigreentick.com/api/v1/sendMessage',
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (resp.status !== 200) {
    throw new Error(`Send message failed: ${resp.content}`);
  }

  return JSON.parse(resp.content);
};

module.exports = {
  key: 'sendMessage',
  noun: 'Message',
  display: {
    label: 'Send Session Message',
    description: 'Send a WhatsApp text message.',
  },
  operation: {
    perform: performSendMessage,
    inputFields: [
      { key: 'recipient_mobile', label: 'Recipient Mobile', type: 'string', required: true },
      { key: 'message', label: 'Message', type: 'text', required: true },
      { key: 'recipient_name', label: 'Recipient Name', type: 'string', required: false },
      { key: 'caption', label: 'Caption', type: 'string', required: false },
      { key: 'reaction', label: 'Reaction', type: 'string', required: false },
      { key: 'isReply', label: 'Is Reply', type: 'boolean', required: false },
    ],
    sample: {
      success: 'Successfully sent message',
      data: {
        id: 34885,
        text: 'testing',
        send_from: '9314766902',
        send_to: '9784690987',
        type: 'sent',
        message_id: 'wamid.XXXX',
        created_at: '2025-07-26T06:59:17.000000Z',
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