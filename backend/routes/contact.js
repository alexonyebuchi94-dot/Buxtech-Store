import express from 'express'

const router = express.Router()

// POST /api/contact — receives contact form submissions.
// For now this just logs the message; wire up email sending (e.g. Resend,
// Nodemailer + SMTP) here when you're ready to actually receive these.
router.post('/', (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing name, email, or message' })
  }

  console.log('New contact message:', { name, email, message })

  res.status(201).json({ received: true })
})

export default router
