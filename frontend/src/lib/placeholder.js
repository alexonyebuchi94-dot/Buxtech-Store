// Placeholder product art — inline SVG so it never breaks or needs hosting.
// Replace with real photos later by setting product.images.
const ICONS = {
  laptop: '<rect x="-70" y="-45" width="140" height="90" rx="8" fill="none" stroke="#00D9FF" stroke-width="4"/><path d="M-90 55h180l-12 14h-156z" fill="#00D9FF" opacity=".8"/>',
  desktop: '<rect x="-75" y="-60" width="150" height="95" rx="8" fill="none" stroke="#00D9FF" stroke-width="4"/><rect x="-8" y="35" width="16" height="22" fill="#00D9FF" opacity=".8"/><rect x="-40" y="57" width="80" height="8" rx="4" fill="#00D9FF"/>',
  gadget: '<rect x="-34" y="-62" width="68" height="124" rx="16" fill="none" stroke="#00D9FF" stroke-width="4"/><circle cx="0" cy="40" r="7" fill="#00D9FF"/><line x1="-14" y1="-44" x2="14" y2="-44" stroke="#00D9FF" stroke-width="4" stroke-linecap="round"/>',
  gaming: '<path d="M-70 10c0-30 14-44 34-44h72c20 0 34 14 34 44 0 22-10 36-24 36-12 0-16-12-26-12h-40c-10 0-14 12-26 12-14 0-24-14-24-36z" fill="none" stroke="#00D9FF" stroke-width="4"/><path d="M-44 -8v20M-54 2h20" stroke="#00D9FF" stroke-width="4" stroke-linecap="round"/><circle cx="40" cy="-2" r="6" fill="#00D9FF"/><circle cx="56" cy="10" r="6" fill="#3B82F6"/>',
  part: '<rect x="-60" y="-40" width="120" height="80" rx="6" fill="none" stroke="#00D9FF" stroke-width="4"/><rect x="-36" y="-16" width="40" height="32" fill="#00D9FF" opacity=".7"/><path d="M-60 -20h-14M-60 0h-14M-60 20h-14M60 -20h14M60 0h14M60 20h14" stroke="#00D9FF" stroke-width="4"/>',
  acc: '<circle cx="0" cy="0" r="50" fill="none" stroke="#00D9FF" stroke-width="4"/><circle cx="0" cy="0" r="22" fill="#00D9FF" opacity=".75"/><path d="M0 -70v14M0 56v14M-70 0h14M56 0h14" stroke="#00D9FF" stroke-width="4" stroke-linecap="round"/>',
}
const TAGS = ['FRONT', 'ANGLE', 'DETAIL', 'IN-BOX']

export function art(label, kind = 'gadget', hue = 195, view = 0) {
  const icon = ICONS[kind] || ICONS.gadget
  const rot = [0, -8, 6, 0][view % 4]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},60%,14%)"/><stop offset="1" stop-color="#0A0E14"/></linearGradient><pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#00D9FF" stroke-opacity=".07"/></pattern></defs><rect width="600" height="600" fill="url(#g)"/><rect width="600" height="600" fill="url(#p)"/><circle cx="300" cy="280" r="190" fill="hsl(${hue},90%,50%)" opacity=".10"/><g transform="translate(300 270) scale(1.7) rotate(${rot})">${icon}</g><text x="300" y="500" font-family="Arial,sans-serif" font-size="26" font-weight="700" fill="#F5F7FA" text-anchor="middle">${label.replace(/&/g, '&amp;').slice(0, 30)}</text><text x="300" y="535" font-family="monospace" font-size="16" fill="#00D9FF" text-anchor="middle" letter-spacing="4">${TAGS[view % 4]} · PLACEHOLDER</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function slideArt(title, sub, hue = 200, kind = 'video') {
  const play = kind === 'video'
    ? '<circle cx="600" cy="225" r="60" fill="none" stroke="#00D9FF" stroke-width="5"/><path d="M585 195l48 30-48 30z" fill="#00D9FF"/>'
    : '<rect x="500" y="150" width="200" height="150" rx="12" fill="none" stroke="#00D9FF" stroke-width="5"/><path d="M520 280l45-60 35 40 25-28 55 48z" fill="#00D9FF" opacity=".6"/>'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},65%,16%)"/><stop offset="1" stop-color="#0A0E14"/></linearGradient><pattern id="p" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#00D9FF" stroke-opacity=".08"/></pattern></defs><rect width="1200" height="600" fill="url(#g)"/><rect width="1200" height="600" fill="url(#p)"/>${play}<text x="600" y="365" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="#F5F7FA" text-anchor="middle">${title}</text><text x="600" y="410" font-family="monospace" font-size="22" fill="#00D9FF" text-anchor="middle" letter-spacing="5">${sub}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
