import { Resend } from 'resend'

// Sends transactional emails via Resend. If RESEND_API_KEY isn't set,
// emails are silently skipped (logged instead) so the rest of the app
// keeps working without this being configured yet.

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const FROM_EMAIL = process.env.EMAIL_FROM || 'BuxTech <onboarding@resend.dev>'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

export async function sendOrderConfirmationEmail(order) {
  if (!resend) {
    console.log('[email] RESEND_API_KEY not set — skipping order confirmation email')
    return
  }

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;color:#333;">${item.name} × ${item.qty}</td>
          <td style="padding:8px 0;text-align:right;color:#333;">${formatNaira(item.price * item.qty)}</td>
        </tr>`
    )
    .join('')

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#0A0E14;">Order Confirmed — BuxTech</h2>
      <p>Hi ${order.customer.name},</p>
      <p>Thanks for your order! We've received your payment and we're getting it ready.</p>
      <p style="color:#666;font-size:14px;">Order #${order.id}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        ${itemsHtml}
        <tr style="border-top:1px solid #ddd;">
          <td style="padding:8px 0;font-weight:bold;">Total</td>
          <td style="padding:8px 0;text-align:right;font-weight:bold;">${formatNaira(order.total)}</td>
        </tr>
      </table>
      <p><strong>Delivering to:</strong><br/>${order.customer.address}, ${order.customer.city}, ${order.customer.state}</p>
      <p style="color:#666;font-size:14px;">Questions? Reply to this email or reach us at buxtech27@gmail.com / 0812 359 0484.</p>
      <p style="color:#999;font-size:12px;margin-top:24px;">— BuxTech</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer.email,
      subject: `Order Confirmed — #${order.id}`,
      html,
    })
  } catch (err) {
    console.error('[email] Failed to send order confirmation:', err.message)
  }
}

const STATUS_SUBJECT = {
  shipped: 'Your order has shipped',
  delivered: 'Your order has been delivered',
  cancelled: 'Your order was cancelled',
  paid: 'Payment received',
}

const STATUS_MESSAGE = {
  shipped: "Good news — your order is on its way! A rider will be delivering it to the address you provided.",
  delivered: "Your order has been marked as delivered. We hope you love it! If anything's wrong, just reply to this email.",
  cancelled: "Your order has been cancelled. If you were charged and weren't expecting this, please contact us right away.",
  paid: "We've confirmed your payment for this order — thanks!",
}

// Sends a short update email when an order's status changes (shipped,
// delivered, cancelled, paid). Silently skipped for statuses with no
// customer-facing message (e.g. 'pending', 'seen').
export async function sendOrderStatusEmail(order, status) {
  const subject = STATUS_SUBJECT[status]
  const message = STATUS_MESSAGE[status]
  if (!subject || !message) return

  if (!resend) {
    console.log(`[email] RESEND_API_KEY not set — skipping "${status}" status email`)
    return
  }

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2 style="color:#0A0E14;">${subject} — BuxTech</h2>
      <p>Hi ${order.customer.name},</p>
      <p>${message}</p>
      <p style="color:#666;font-size:14px;">Order #${order.id}</p>
      <p style="color:#666;font-size:14px;">Questions? Reply to this email or reach us at buxtech27@gmail.com / 0812 359 0484.</p>
      <p style="color:#999;font-size:12px;margin-top:24px;">— BuxTech</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer.email,
      subject: `${subject} — #${order.id}`,
      html,
    })
  } catch (err) {
    console.error(`[email] Failed to send "${status}" status email:`, err.message)
  }
}
