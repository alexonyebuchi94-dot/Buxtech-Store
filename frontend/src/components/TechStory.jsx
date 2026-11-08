// Landing page: what tech is, why it matters, tech in daily life, and quotes.
const blocks = [
  { k: '01', title: 'WHAT IS TECH?', body: 'Technology is knowledge turned into tools. From the first wheel to the laptop on your desk, it is humanity’s habit of solving problems with better ideas — and then making those ideas small, fast and affordable enough for everyone.' },
  { k: '02', title: 'WHY TECH MATTERS', body: 'It saves time, widens opportunity and levels the field. A student with a laptop can learn from anywhere. A small business with a phone and a payment link can sell to the whole country. Access to good tech is access to a bigger future.' },
  { k: '03', title: 'TECH IN DAILY LIFE', body: 'You wake up to a phone alarm, pay with a tap, work on a laptop, cook with smart appliances, stay in touch over video and unwind with a game. Good tech disappears into your day and quietly makes every part of it easier.' },
]
const quotes = [
  { q: 'Knowledge is power.', a: 'Francis Bacon', s: 'Meditationes Sacrae, 1597' },
  { q: 'The true creator is necessity, who is the mother of our invention.', a: 'Plato', s: 'The Republic (Jowett translation)' },
  { q: 'The essence of technology is by no means anything technological.', a: 'Martin Heidegger', s: 'The Question Concerning Technology, 1954' },
  { q: 'We shape our tools, and thereafter our tools shape us.', a: 'Marshall McLuhan', s: 'attributed · Understanding Media circle' },
]

export default function TechStory() {
  return (
    <>
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-cyan font-mono-price text-xs tracking-widest mb-2">THE BIG IDEA</div>
          <h2 className="font-display text-3xl sm:text-5xl text-ink">TECH, EXPLAINED</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {blocks.map((b) => (
            <article key={b.k} className="border border-border rounded-xl p-6 bg-surface hover:border-cyan transition-colors">
              <div className="font-mono-price text-cyan text-sm mb-3">{b.k}</div>
              <h3 className="font-display text-xl text-ink mb-3">{b.title}</h3>
              <p className="text-muted leading-relaxed">{b.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl sm:text-3xl text-ink text-center mb-8">WORDS THAT SHAPED TECH</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {quotes.map((x) => (
            <figure key={x.a} className="border-l-2 border-cyan pl-5 py-2">
              <blockquote className="text-ink text-lg sm:text-xl leading-snug">“{x.q}”</blockquote>
              <figcaption className="text-muted text-sm mt-2"><span className="text-cyan">{x.a}</span> · {x.s}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}
