const htmlEscape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character])

function eventUrl (value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

function eventRow ({ event, when }) {
  const name = htmlEscape(event.name || 'Unnamed event')
  const url = eventUrl(event.url)
  const title = url
    ? `<a href="${htmlEscape(url)}" style="color:#075a9c;text-decoration:underline;font-weight:700">${name}</a>`
    : `<strong style="color:#18334d">${name}</strong>`

  return `<tr><td style="padding:0 28px 16px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f1f7fc;border-left:4px solid #23a7bd">
      <tr><td style="padding:16px 18px;font:16px/1.5 Arial,Helvetica,sans-serif;color:#18334d">
        <span style="display:block;color:#41627b;font-size:13px;font-weight:700">${htmlEscape(when)}</span>
        ${title}
      </td></tr>
    </table>
  </td></tr>`
}

function monthRows ({ title, events }) {
  const rows = events.length
    ? events.map(eventRow).join('')
    : '<tr><td style="padding:0 28px 16px;font:15px/1.5 Arial,Helvetica,sans-serif;color:#41627b">No events are currently scheduled.</td></tr>'
  return `<tr><td style="padding:18px 28px 14px;font:700 22px/1.3 Arial,Helvetica,sans-serif;color:#123b5d">${htmlEscape(title)}</td></tr>${rows}`
}

export function buildNewsletterEmail (months) {
  const sections = months.map(monthRows).join('')
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lansing Codes events</title></head>
<body style="margin:0;padding:0;background:#eaf0f5;color:#18334d">
<span style="display:none!important;font-size:1px;line-height:1px;color:#eaf0f5;max-height:0;max-width:0;opacity:0;overflow:hidden">Meet, learn, and build with Lansing Codes.</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#eaf0f5"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:600px;background:#ffffff">
    <tr><td style="padding:28px;background:#0b507f;color:#ffffff;font:700 30px/1.2 Arial,Helvetica,sans-serif">Lansing Codes</td></tr>
    <tr><td style="padding:24px 28px 4px;font:16px/1.6 Arial,Helvetica,sans-serif;color:#18334d">Find your next chance to connect, learn, and build with the Lansing tech community.</td></tr>
    ${sections}
    <tr><td style="padding:18px 28px;background:#eaf0f5;font:13px/1.6 Arial,Helvetica,sans-serif;color:#41627b">Lansing Codes · Lansing, Michigan<br><a href="https://www.lansing.codes/" style="color:#075a9c">Visit the website</a> · <a href="*|UNSUB|*" style="color:#075a9c">Unsubscribe</a><br>*|LIST:ADDRESS|*</td></tr>
  </table>
</td></tr></table>
</body></html>`

  const text = ['Lansing Codes — upcoming events', '',
    ...months.flatMap(month => [month.title, ...(
      month.events.length
        ? month.events.flatMap(({ event, when }) => [`${when} — ${event.name || 'Unnamed event'}`, ...(eventUrl(event.url) ? [eventUrl(event.url)] : [])])
        : ['No events are currently scheduled.']
    ), '']),
    'https://www.lansing.codes/', 'Unsubscribe: *|UNSUB|*'].join('\n')

  return { html, text }
}
