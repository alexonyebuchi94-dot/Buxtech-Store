export default function Warranty() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-display text-5xl text-ink mb-8 tracking-wide">WARRANTY</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p>Last updated: August 2026</p>
        <p>
          Electronics and appliances sold on BuxTech are covered against manufacturing
          defects for a standard warranty period from the date of delivery, unless otherwise
          stated on the individual product page.
        </p>
        <p>
          To make a warranty claim, contact us at{' '}
          <a href="mailto:buxtech27@gmail.com" className="text-cyan hover:underline">
            buxtech27@gmail.com
          </a>{' '}
          or{' '}
          <a href="tel:+2348123590484" className="text-cyan hover:underline">
            0812 359 0484
          </a>{' '}
          with your order number, a description of the fault, and photos or video if possible.
        </p>
        <p>
          Warranty covers manufacturing defects only. It does not cover damage from misuse,
          unauthorized repair, power surges, liquid damage, or normal wear and tear.
        </p>
        <p>
          Approved warranty claims are repaired or replaced at BuxTech's discretion.
        </p>
      </div>
    </div>
  )
}
