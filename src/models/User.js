import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  bio: String,
  web3_address: String,
  web3_provider: String,
  nonce: String,
  network_id: Number,
  meta: {
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
  }
}, { collection: 'User' });

export default mongoose.model('User', userSchema);