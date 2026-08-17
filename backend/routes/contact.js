const express = require('express');
const { Resend } = require('resend');

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  try {
    await resend.emails.send({
      from: 'BuxTech Contact Form <orders@buxtech.com.ng>',
      to: 'buxtech27@gmail.com',
      reply_to: email,
      subject: `New contact form message from ${name}`,
      html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message}</p>`,
    });
    res.json({ message: 'Sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
