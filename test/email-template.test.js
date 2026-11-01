import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { buildNewsletterEmail } from '../email-template.js'

test('builds a table-based email with safe links and Mailchimp footer tags', () => {
  const { html, text } = buildNewsletterEmail([
    { title: 'October 2026', events: [{ event: {
      name: '<img src=x onerror=alert(1)>',
      url: 'javascript:alert(1)',
    }, when: '30th (Fri) 7pm' }] },
    { title: 'November 2026', events: [{ event: {
      name: 'DevOps & Friends',
      url: 'https://example.org/event?one=1&two=2',
    }, when: '10th (Tue) 6pm' }] },
  ])
  const doc = new JSDOM(html).window.document

  assert.equal(doc.querySelector('img'), null)
  assert.equal(doc.querySelector('a[href^="javascript:"]'), null)
  assert.equal(doc.querySelectorAll('table[role="presentation"]').length >= 3, true)
  assert.deepEqual([...doc.querySelectorAll('h2')].map(heading => heading.textContent), ['October 2026', 'November 2026'])
  assert.match(doc.body.textContent, /<img src=x onerror=alert\(1\)>/)
  assert.match(doc.body.textContent, /DevOps & Friends/)
  assert.equal(doc.querySelector('a[href^="https://example.org/"]').href, 'https://example.org/event?one=1&two=2')
  assert.match(html, /\*\|UNSUB\|\*/)
  assert.match(html, /\*\|LIST:ADDRESS\|\*/)
  assert.match(text, /DevOps & Friends/)
  assert.doesNotMatch(text, /javascript:alert/)
})
