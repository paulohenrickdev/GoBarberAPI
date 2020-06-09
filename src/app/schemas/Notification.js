import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Number,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  }
}, {
  timestamps: true, // Com isso ele cria o createdAt e o UpdatedAt por padrão
});

export default mongoose.model('Notification', NotificationSchema);
