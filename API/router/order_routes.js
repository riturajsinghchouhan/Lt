import express from 'express';
import OrderModel from '../model/order_model.js';

const router = express.Router();

// Place Order
router.post('/place', async (req, res) => {
  try {
    const order = new OrderModel(req.body);
    await order.save();
    res.send({ success: true, message: 'Order placed!' });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Failed to place order' });
  }
});

router.post('/cancel',async(req,res)=>{
  try{
    const {orderId}=req.body;
    await OrderModel.updateOne({_id:orderId},{status:'Cancelled'});
    res.json({success:true,message:'Order cancelled'});
  }
  catch (err) {
    res.status(500).send({ success: false, message: 'Failed to place order' });
  }
})

// Fetch All Orders (Admin)
router.get('/all', async (req, res) => { 
  //console.log("h1")
  const orders = await OrderModel.find().sort({ createdAt: -1 });
  res.send(orders);
});

// Fetch Orders by userId
router.get('/orders', async (req, res) => {
  
  const { userId } = req.query;
 
  if (!userId) return res.status(400).send({ success: false, message: 'User ID is required' });

  try {
    const userOrders = await OrderModel.find({ userId }).sort({ createdAt: -1 });
    res.send(userOrders);
  } catch (err) {
    console.log(err)
    res.status(500).send({ success: false, message: 'Failed to fetch orders' });
  }
});

// Update Order Status
router.put('/status/:id', async (req, res) => {
  await OrderModel.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.send({ success: true });
});

export default router;




