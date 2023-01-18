const express=require('express')
const app=express()
require('dotenv').config()
require('./database/connection')
const bodyParser=require('body-parser')

const categoryRoutes=require('./routes/categoryroute')
const productRoutes=require('./routes/productRoute')
const userRoutes=require('./routes/userRoute')
const orderRoute=require('./routes/orderRoutes')
const paymentRoute=require('./routes/paymentroutes')
const cors=require('cors')
// middleware
app.use(bodyParser.json())
app.use('/public/uploads',express.static('public/uploads'))
app.use(cors())

// app.get('/test',(req,res)=>{
//     res.send('hello to express js')
// })

// routes middleware
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api',userRoutes)
app.use('/api',orderRoute)
app.use('/api',paymentRoute)



port=process.env.PORT || 4000
app.listen(port,()=>{
    console.log(`server started on port ${port}`)
})