const OrderItem=require('../models/order-item')
const Order=require('../models/orderModel')
const { productValidation } = require('../validation/validator')

//post order
exports.postOrder=async(req,res)=>{
    const orderItemsIds=Promise.all(req.body.orderItems.map(async(orderItem)=>{
        let newOrderItem=new OrderItem({
            quantity:orderItem.quantity,
            product:orderItem.product
        })
        newOrderItem= await newOrderItem.save()
        return newOrderItem._id
    }))
    const orderItemIdsResolved= await orderItemsIds
    //calculate total price
    const totalPrice= await Promise.all(orderItemIdsResolved.map(async(orderId)=>{
        const itemOrder=await OrderItem.findById(orderId).populate('product','product_price')
        const total=itemOrder.quantity*itemOrder.product.product_price
        return total
    }))
    const TotalPrice=totalPrice.reduce((a,b)=>a+b,0)

    let order=new Order({
        orderItems:orderItemIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        totalPrice:TotalPrice,
        user:req.body.user
    })
    order= await order.save()
    if(!order){
        return res.status(400).json({error:'something went wrong'})
        }
        res.send(order)
}

//order list
exports.orderList=async(req,res)=>{
    const list=await Order.find()
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }})
    .sort({dateOrdered:-1})
    if(!list){
        return res.status(400).json({error:'something went wrong'})
    }
    res.send(list)
} 

//order detalis

exports.orderDetails=async(req,res)=>{
const details=await Order.findById(
    req.params.id
    )
    .populate('user','name')
    .populate({
        path:'orderItems',populate:{
            path:'product',populate:'category'
        }
})

if(!details){
    return res.status(400).json({error:'something went wrong'})
}    
res.send(details)
}

//update status
exports.updateStatus=async(req,res)=>{
    const order= await Order.findByIdAndUpdate(
        req.params.id,
        {
            status:req.body.status
        },
        {new:true}
    )
    if(!order){
        return res.status(400).json({error:'something went wrong'})
    }    
    res.send(order)
    }

    //user order show

    exports.userOrders=async(req,res)=>{
        const userOrdersList= await Order.find({user:req.params.userId})
            .populate('user','name')
            .populate({
                path:'orderItems',populate:{
                    path:'product',populate:'category'
                }})  
        if(!userOrdersList){
            return res.status(400).json({error:'something went wrong'})
        }    
        res.send(userOrdersList)
        }
    
