import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import ordersRouter from './routes/orders.js'
import paymentRouter from './routes/payment.js'
import contactRouter from './routes/contact.js'
import reviewsRouter from './routes/reviews.js'
import authRouter from './routes/auth.js'

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
app.use('/api/reviews', reviewsRouter)
app.use('/api/auth', authRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`BuxTech backend running on port ${PORT}`)
})
