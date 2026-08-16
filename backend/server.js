import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import paymentRouter from './routes/payment.js'
import contactRouter from './routes/contact.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'BuxTech API is running' })
})

app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/contact', contactRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`BuxTech backend running on port ${PORT}`)
})
