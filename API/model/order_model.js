import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: String,
  name: String,
  mobile: String,
  address: String,
  location: String,
  cake: String,
  weight: String,
  quantity: Number,
  message: String,
  total: Number,
  paymentMode: String,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
   

});

const OrderModel = mongoose.model('order_collection', OrderSchema);
export default OrderModel;


