const uploadMedia = async (z, bundle) => {
  // First upload the media file
  const uploadResponse = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/wa-template/media',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
    },
    body: {
      media: bundle.inputData.media_file,
    },
    form: true,
  });

  return uploadResponse.data;
};

const performSendMediaMessage = async (z, bundle) => {
  let media_url = bundle.inputData.media_url;

  // If a file is uploaded instead of URL, upload it first
  if (bundle.inputData.media_file && !media_url) {
    const uploadResult = await uploadMedia(z, bundle);
    media_url = uploadResult.public_url;
  }

  const response = await z.request({
    method: 'POST',
    url: 'https://aigreentick.com/api/v1/sendMessage',
    headers: {
      Authorization: `Bearer ${bundle.authData.api_token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      message: bundle.inputData.caption || '',
      recipient_mobile: bundle.inputData.recipient_mobile,
      recipient_name: bundle.inputData.recipient_name || '',
      template_id: null,
      reaction: '',
      isReply: false,
      media_type: bundle.inputData.media_type,
      media_url: media_url,
      filename: bundle.inputData.filename || '',
      caption: bundle.inputData.caption || '',
      channel: bundle.inputData.channel,
    },
  });

  return response.data;
};

module.exports = {
  key: 'sendMediaMessage',
  noun: 'Media Message',
  display: {
    label: 'Send Media Message',
    description: 'Send a WhatsApp message with media (image, video, document).',
  },
  operation: {
    perform: performSendMediaMessage,

    inputFields: [
      {
        key: 'recipient_mobile',
        label: 'Recipient Mobile',
        type: 'string',
        required: true,
        helpText: 'Mobile number of the recipient (with country code)',
      },
      {
        key: 'media_type',
        label: 'Media Type',
        type: 'string',
        required: true,
        choices: ['image', 'video', 'document'],
        helpText: 'Type of media to send',
      },
      {
        key: 'media_url',
        label: 'Media URL',
        type: 'string',
        required: false,
        helpText: 'Direct URL to the media file',
      },
      {
        key: 'media_file',
        label: 'Media File',
        type: 'file',
        required: false,
        helpText: 'Upload media file directly (alternative to URL)',
      },
      {
        key: 'caption',
        label: 'Caption',
        type: 'text',
        required: false,
        helpText: 'Caption/message text to accompany the media',
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
        key: 'filename',
        label: 'Filename',
        type: 'string',
        required: false,
        helpText: 'Filename for document type media',
      },
    ],

    sample: {
      success: 'Successfully sent message',
      data: {
        id: 34885,
        user_id: 41,
        text: 'https://aigreentick.com/storage/uploads/1753513109_Screenshot.png',
        send_from: '7891976320',
        send_to: '9799605400',
        type: 'sent',
        is_media: '1',
        message_id: 'wamid.HBgMOTE5Nzk5NjA1NDAwFQIAERgSMTY4NDdENjI2QjQ4MTlGNzMwAA==',
        created_at: '2025-07-26T06:59:17.000000Z',
      },
    },

    outputFields: [
      { key: 'success', label: 'Success Message', type: 'string' },
      { key: 'data__id', label: 'Message ID', type: 'integer' },
      { key: 'data__text', label: 'Media URL', type: 'string' },
      { key: 'data__is_media', label: 'Is Media', type: 'string' },
      { key: 'data__message_id', label: 'WhatsApp Message ID', type: 'string' },
      { key: 'data__created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
