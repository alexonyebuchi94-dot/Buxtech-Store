import { useState } from 'react';

export default function Checkout({ cartItems, user, token }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Create the order (status: pending/unpaid)
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cartItems.map((i) => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
          address,
          phone,
        }),
      });
      const order = await orderRes.json();

      // 2. Initialize Paystack payment and redirect
      const payRes = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: order.id, email: user.email, amount: total }),
      });
      const payment = await payRes.json();
      window.location.href = payment.authorization_url; // hands off to Paystack's hosted page
    } catch (err) {
      alert('Something went wrong placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex gap-2 mb-8 text-sm">
        {['Address', 'Payment', 'Summary'].map((label, i) => (
          <div key={label} className={`flex-1 text-center py-2 rounded ${step === i + 1 ? 'bg-cyan-400 text-black font-bold' : 'bg-[#0d1117] text-gray-400'}`}>
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <label className="block text-gray-400 mb-2">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full bg-[#0d1117] border border-gray-700 rounded p-3 text-white mb-4"
            rows={3}
          />
          <label className="block text-gray-400 mb-2">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#0d1117] border border-gray-700 rounded p-3 text-white mb-4"
          />
          <button onClick={() => setStep(2)} disabled={!address || !phone} className="bg-cyan-400 text-black font-bold px-6 py-2 rounded disabled:opacity-50">
            Continue to Payment
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-gray-300 mb-4">You'll be redirected to Paystack's secure page to pay by card, bank transfer, or USSD.</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="border border-gray-700 text-gray-300 px-6 py-2 rounded">Back</button>
            <button onClick={() => setStep(3)} className="bg-cyan-400 text-black font-bold px-6 py-2 rounded">Review Order</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="text-white font-bold mb-3">Order Summary</h3>
          {cartItems.map((i) => (
            <div key={i.product.id} className="flex justify-between text-gray-300 py-1">
              <span>{i.product.name} × {i.quantity}</span>
              <span>₦{(i.product.price * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between text-white font-bold border-t border-gray-800 mt-3 pt-3">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-cyan-400 text-black font-bold py-3 rounded mt-6 disabled:opacity-50"
          >
            {loading ? 'Redirecting to payment...' : 'Place Order & Pay'}
          </button>
        </div>
      )}
    </div>
  );
}
