import test from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { eventQuery, fetchEvents } from '../events.js'
import { appendEvent } from '../render.js'

test('queries the event range in start-time order', () => {
  const query = eventQuery(10, 20).structuredQuery
  assert.equal(query.from[0].collectionId, 'events')
  assert.deepEqual(query.where.compositeFilter.filters.map((filter) => filter.fieldFilter.value.integerValue), ['10', '20'])
  assert.equal(query.orderBy[0].field.fieldPath, 'startTime')
})

test('reads event fields from Firestore REST rows without an API key', async () => {
  const events = await fetchEvents(10, 20, async (url, options) => {
    assert.equal(url, 'https://firestore.googleapis.com/v1/projects/lansing-codes/databases/(default)/documents:runQuery')
    assert.equal(options.method, 'POST')
    return {
      ok: true,
      json: async () => [{ document: { fields: {
        name: { stringValue: 'Meetup' },
        url: { stringValue: 'https://example.org/event' },
        startTime: { integerValue: '15' },
      } } }],
    }
  })
  assert.deepEqual(events, [{ name: 'Meetup', url: 'https://example.org/event', startTime: 15 }])
})

test('renders names as text and rejects unsafe links', () => {
  const doc = new JSDOM('<ul></ul>').window.document
  const list = doc.querySelector('ul')
  appendEvent(list, { name: '<img src=x onerror=alert(1)>', url: 'javascript:alert(1)' }, '7pm', doc)
  assert.equal(list.querySelector('img'), null)
  assert.equal(list.querySelector('a'), null)
  assert.match(list.textContent, /<img src=x onerror=alert\(1\)>/)
  appendEvent(list, { name: 'Safe', url: 'https://example.org' }, '8pm', doc)
  assert.equal(list.querySelector('a').href, 'https://example.org/')
})
