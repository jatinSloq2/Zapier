
// const FormData = require('form-data');
// const mime = require('mime-types'); // Add this dependency to detect file types

// const performSendMessage = async (z, bundle) => {
//   const token = bundle.authData.api_token;
//   let mediaUrl = null;
//   let mediaType = null;

//   // Step 1: Upload file if provided
//   if (bundle.inputData.file) {
//     const fileUrl = await z.stashFile(bundle.inputData.file);
//     const fileResp = await z.request({ url: fileUrl, raw: true });

//     // Detect MIME type from extension (fallback to application/octet-stream)
//     const ext = (bundle.inputData.file || '').split('.').pop();
//     const mimeType = mime.lookup(ext) || 'application/octet-stream';

//     const form = new FormData();
//     form.append('media', fileResp.content, { filename: `upload.${ext}`, contentType: mimeType });

//     const uploadResp = await z.request({
//       url: 'https://aigreentick.com/api/v1/wa-template/media',
//       method: 'POST',
//       body: form,
//       headers: form.getHeaders(),
//     });

//     if (uploadResp.status !== 200) {
//       throw new Error(`Media upload failed: ${uploadResp.content}`);
//     }

//     const uploadJson = JSON.parse(uploadResp.content);
//     mediaUrl = uploadJson.public_url;

//     // Map MIME to WhatsApp-friendly type
//     if (mimeType.startsWith('image/')) {
//       mediaType = 'IMAGE';
//     } else if (mimeType.startsWith('video/')) {
//       mediaType = 'VIDEO';
//     } else {
//       mediaType = 'DOCUMENT';
//     }
//   }

//   // Step 2: Fetch channel automatically
//   const channelResp = await z.request({
//     url: 'https://aigreentick.com/api/v1/sendMessage',
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,
//       Accept: 'application/json',
//     },
//   });

//   if (channelResp.status !== 200) {
//     throw new Error(`Failed to fetch channel: ${channelResp.content}`);
//   }

//   const channelData = JSON.parse(channelResp.content);
//   if (!channelData.channel || !channelData.channel.length) {
//     throw new Error('No channel found for this account.');
//   }

//   // Take first channel for now
//   const whatsappNo = channelData.channel[0].whatsapp_no;
//   const channel = whatsappNo.startsWith('91')
//     ? whatsappNo.substring(2) // strip India country code
//     : whatsappNo;

//   // Step 3: Build payload
//   const payload = {
//     message: bundle.inputData.message || '',
//     recipient_mobile: bundle.inputData.recipient_mobile,
//     recipient_name: bundle.inputData.recipient_name || '',
//     template_id: null,
//     reaction: bundle.inputData.reaction || '',
//     isReply: bundle.inputData.isReply || false,
//     caption: bundle.inputData.caption || '',
//     channel, // auto-fetched
//   };

//   if (mediaUrl) {
//     payload.media_type = mediaType; // IMAGE / VIDEO / DOCUMENT
//     payload.media_url = mediaUrl;
//     payload.filename = bundle.inputData.file || '';
//   }

//   // Step 4: Send actual WhatsApp message
//   const resp = await z.request({
//     url: 'https://aigreentick.com/api/v1/sendMessage',
//     method: 'POST',
//     body: JSON.stringify(payload),
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (resp.status !== 200) {
//     throw new Error(`Send message failed: ${resp.content}`);
//   }

//   return JSON.parse(resp.content);
// };

// module.exports = {
//   key: 'sendMessage',
//   noun: 'Message',
//   display: {
//     label: 'Send Session Message',
//     description: 'Send a WhatsApp message (text or media) to an open session.',
//   },
//   operation: {
//     perform: performSendMessage,
//     inputFields: [
//       { key: 'recipient_mobile', label: 'Recipient Mobile', type: 'string', required: true },
//       { key: 'message', label: 'Message', type: 'text', required: false },
//       { key: 'recipient_name', label: 'Recipient Name', type: 'string', required: false },
//       { key: 'caption', label: 'Caption', type: 'string', required: false },
//       { key: 'reaction', label: 'Reaction', type: 'string', required: false },
//       { key: 'isReply', label: 'Is Reply', type: 'boolean', required: false },
//       { key: 'file', label: 'Media File', type: 'file', required: false, helpText: 'Upload a file manually or select from a previous step.', placeholder: 'Upload or map dynamically' },
//     ],
//     sample: {
//       success: 'Successfully sent message',
//       data: {
//         id: 34885,
//         text: 'https://aigreentick.com/storage/uploads/example.png',
//         send_from: '7891976320',
//         send_to: '9799605400',
//         type: 'sent',
//         message_id: 'wamid.XXXX',
//         created_at: '2025-07-26T06:59:17.000000Z',
//       },
//     },
//     outputFields: [
//       { key: 'success', label: 'Success Message', type: 'string' },
//       { key: 'data__id', label: 'Message ID', type: 'integer' },
//       { key: 'data__text', label: 'Message Text/URL', type: 'string' },
//       { key: 'data__send_from', label: 'Sent From', type: 'string' },
//       { key: 'data__send_to', label: 'Sent To', type: 'string' },
//       { key: 'data__message_id', label: 'WhatsApp Message ID', type: 'string' },
//       { key: 'data__created_at', label: 'Created At', type: 'datetime' },
//     ],
//   },
// };
