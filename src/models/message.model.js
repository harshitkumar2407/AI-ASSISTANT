import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: [true, 'Chat ID is required'],
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
  },
  role: {
    type: String,
    enum: ['user', 'ai'],
    required: [true, 'Role must be either user or ai'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const MessageModel = mongoose.model('Message', messageSchema);

export default MessageModel;
