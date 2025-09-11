const FormData = require('form-data');

const performSendMessage = async (z, bundle) => {
  let mediaUrl = null;
  let mediaType = null;

  if (bundle.inputData.file) {
    // Step 1: Stash the file (Zapier CDN URL)
    const fileUrl = await z.stashFile(bundle.inputData.file);

    // Step 2: Fetch raw binary back
    const fileResp = await z.request({
      url: fileUrl,
      raw: true, // get binary content
    });

    // Step 3: Upload to Aigreentick API as form-data
    const form = new FormData();
    form.append('media', fileResp.content, {
      filename: 'upload.png', // you can parse real filename if needed
    });

    const uploadResp = await z.request({
      url: 'https://aigreentick.com/api/v1/wa-template/media',
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (uploadResp.status !== 200) {
      throw new Error(`Media upload failed: ${uploadResp.content}`);
    }

    const uploadJson = JSON.parse(uploadResp.content);

    // ✅ Use the public_url from API response
    mediaUrl = uploadJson.public_url;
    mediaType = 'image'; // You could detect mime-type if needed
  }

  // Step 4: Build payload for sendMessage
  const payload = {
    message: bundle.inputData.message || '',
    recipient_mobile: bundle.inputData.recipient_mobile,
    recipient_name: bundle.inputData.recipient_name || '',
    template_id: null,
    reaction: bundle.inputData.reaction || '',
    isReply: bundle.inputData.isReply || false,
    caption: bundle.inputData.caption || '',
    channel: bundle.inputData.channel,
  };

  // Step 5: Attach media info if uploaded
  if (mediaUrl) {
    payload.media_type = mediaType;
    payload.media_url = mediaUrl;
    payload.filename = bundle.inputData.file || '';
  }

  // Step 6: Send actual WhatsApp message
  const resp = await z.request({
    url: 'https://aigreentick.com/api/v1/sendMessage',
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
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
    description: 'Send a WhatsApp message (text or media) to an open session.',
  },
  operation: {
    perform: performSendMessage,

    inputFields: [
      { key: 'recipient_mobile', label: 'Recipient Mobile', type: 'string', required: true },
      { key: 'message', label: 'Message', type: 'text', required: false },
      { key: 'recipient_name', label: 'Recipient Name', type: 'string', required: false },
      { key: 'caption', label: 'Caption', type: 'string', required: false },
      { key: 'channel', label: 'Channel', type: 'string', required: true },
      { key: 'reaction', label: 'Reaction', type: 'string', required: false },
      { key: 'isReply', label: 'Is Reply', type: 'boolean', required: false },
      { key: 'file', label: 'Media File', type: 'file', required: false, helpText: 'Upload an image/video/document.' },
    ],

    sample: {
      success: 'Successfully sent message',
      data: {
        id: 34885,
        text: 'https://aigreentick.com/storage/uploads/example.png',
        send_from: '7891976320',
        send_to: '9799605400',
        type: 'sent',
        message_id: 'wamid.XXXX',
        created_at: '2025-07-26T06:59:17.000000Z',
      },
    },

    outputFields: [
      { key: 'success', label: 'Success Message', type: 'string' },
      { key: 'data__id', label: 'Message ID', type: 'integer' },
      { key: 'data__text', label: 'Message Text/URL', type: 'string' },
      { key: 'data__send_from', label: 'Sent From', type: 'string' },
      { key: 'data__send_to', label: 'Sent To', type: 'string' },
      { key: 'data__message_id', label: 'WhatsApp Message ID', type: 'string' },
      { key: 'data__created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
