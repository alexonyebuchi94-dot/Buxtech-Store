import { Shield, Truck, Award } from './Icons.jsx'
const badges = [
  { I: Shield, t: 'Secure Payment', d: 'Paystack-encrypted · Card, Transfer, USSD' },
  { I: Truck, t: 'Fast Delivery', d: 'Lagos in 1–2 days · nationwide tracked' },
  { I: Award, t: 'Warranty', d: '12-month warranty on every product' },
]
export default function TrustBadges({ compact = false }) {
  return (
    <div className={`grid ${compact ? 'grid-cols-1 gap-2' : 'grid-cols-1 sm:grid-cols-3 gap-4'}`}>
      {badges.map(({ I, t, d }) => (
        <div key={t} className="flex items-center gap-3 border border-border rounded-lg px-4 py-3 bg-surface">
          <span className="w-10 h-10 shrink-0 rounded-full border border-cyan/50 text-cyan flex items-center justify-center"><I /></span>
          <div><div className="text-ink text-sm font-medium">{t}</div><div className="text-muted text-xs">{d}</div></div>
        </div>
      ))}
    </div>
  )
}
