const sendMessage = require('./sendMessage');
const sendTemplateMessage = require('./sendTemplateMessage');
const sendMediaMessage = require('./sendMediaMessage');
const { broadcastMessage } = require('./broadcastMessage');

module.exports = {
  sendMessage,
  sendTemplateMessage,
  sendMediaMessage,
  broadcastMessage,
};