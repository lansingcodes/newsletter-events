import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'

test('Lansing month query and displayed times are stable outside Eastern time', async () => {
  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    fetch: globalThis.fetch,
    timezone: process.env.TZ,
  }
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' })
  const queries = []

  try {
    process.env.TZ = 'America/Los_Angeles'
    for (const name of ['moment.min.js', 'moment-timezone.min.js', 'moment-timezone-detroit.js']) {
      dom.window.eval(readFileSync(new URL(`../vendor/${name}`, import.meta.url), 'utf8'))
    }
    dom.window.moment.now = () => Date.parse('2027-03-01T05:30:00Z')
    globalThis.window = dom.window
    globalThis.document = dom.window.document
    globalThis.fetch = async (_url, options) => {
      const filters = JSON.parse(options.body).structuredQuery.where.compositeFilter.filters
      const [start, end] = filters.map(({ fieldFilter }) => Number(fieldFilter.value.integerValue))
      queries.push([start, end])
      const event = (name, instant) => ({ document: { fields: {
        name: { stringValue: name },
        url: { stringValue: 'https://example.org/event' },
        startTime: { integerValue: String(Date.parse(instant)) },
      } } })
      return {
        ok: true,
        json: async () => start === Date.parse('2027-03-01T05:00:00Z')
          ? [event('Month boundary', '2027-03-01T05:30:00Z'), event('DST change', '2027-03-14T07:30:00Z')]
          : [],
      }
    }

    await import(`../index.js?timezone-test=${Math.random()}`)
    await new Promise(resolve => setImmediate(resolve))

    assert.equal(document.getElementById('current-month-name').textContent, 'March')
    assert.equal(document.getElementById('next-month-name').textContent, 'April')
    assert(queries.some(([start, end]) =>
      start === Date.parse('2027-03-01T05:00:00Z') && end === Date.parse('2027-04-01T03:59:59.999Z')))
    assert(queries.some(([start]) => start === Date.parse('2027-04-01T04:00:00Z')))
    const list = document.getElementById('current-month-event-list').textContent
    assert.match(list, /1st \(Mon\) 12:30 am.*Month boundary/)
    assert.match(list, /14th \(Sun\) 3:30 am.*DST change/)
  } finally {
    globalThis.window = previous.window
    globalThis.document = previous.document
    globalThis.fetch = previous.fetch
    if (previous.timezone === undefined) delete process.env.TZ
    else process.env.TZ = previous.timezone
    dom.window.close()
  }
})
