import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSent(true);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">Contact Us</h1>
      <p className="text-gray-400 mb-6">buxtech27@gmail.com · 08123590484 · Lagos, Nigeria</p>

      {sent ? (
        <p className="text-cyan-400">Thanks — we'll get back to you shortly.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white"
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white"
          />
          <textarea
            required
            placeholder="Message"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-[#0d1117] border border-gray-700 rounded px-3 py-2 text-white"
          />
          <button className="bg-cyan-400 text-black font-bold px-6 py-2 rounded">Send Message</button>
        </form>
      )}
    </div>
  );
}
