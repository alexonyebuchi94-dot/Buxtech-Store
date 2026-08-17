const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'BuxTech <orders@buxtech.com.ng>'; // must be a verified domain in Resend

async function sendOrderConfirmedEmail(order) {
  // In production, fetch the user's email by order.user_id first.
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email, // pass this in when you call it, or join from users table
      subject: `Order ${order.order_ref} confirmed — BuxTech`,
      html: `
        <h2>Thanks for your order!</h2>
        <p>Your order <strong>${order.order_ref}</strong> has been confirmed and is being prepared.</p>
        <p>Total: ₦${Number(order.total).toLocaleString()}</p>
        <p>We'll email you again once it ships.</p>
      `,
    });
  } catch (err) {
    console.error('Failed to send order confirmation email:', err);
  }
}

async function sendOrderShippedEmail(order) {
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Order ${order.order_ref} has shipped — BuxTech`,
      html: `<p>Your order <strong>${order.order_ref}</strong> is on its way. Delivery: Lagos 24-48hrs, other states 3-5 days.</p>`,
    });
  } catch (err) {
    console.error('Failed to send shipping email:', err);
  }
}

async function sendOrderDeliveredEmail(order) {
  try {
    await resend.emails.send({
      from: FROM,
      to: order.email,
      subject: `Order ${order.order_ref} delivered — BuxTech`,
      html: `<p>Your order <strong>${order.order_ref}</strong> has been delivered. Enjoy! Got an issue? Reply to this email.</p>`,
    });
  } catch (err) {
    console.error('Failed to send delivered email:', err);
  }
}

module.exports = { sendOrderConfirmedEmail, sendOrderShippedEmail, sendOrderDeliveredEmail };
