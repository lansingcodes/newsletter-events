import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import moment from 'moment'

test('older event loads cannot append stale dates or errors after a refresh', async () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const dom = new JSDOM(html, { url: 'http://localhost/' })
  const previous = { window: globalThis.window, document: globalThis.document, fetch: globalThis.fetch }
  const pending = []

  try {
    globalThis.window = dom.window
    globalThis.document = dom.window.document
    window.moment = moment
    globalThis.fetch = () => new Promise((resolve, reject) => pending.push({ resolve, reject }))

    await import(`../index.js?refresh-test=${Date.now()}`)
    assert.equal(pending.length, 2)

    document.getElementById('date-format').value = '[NEW] h:mm a'
    document.getElementById('refresh-format').click()
    assert.equal(pending.length, 4)

    const row = { document: { fields: {
      name: { stringValue: 'Race test' },
      url: { stringValue: 'https://example.org/event' },
      startTime: { integerValue: String(moment().valueOf()) },
    } } }
    const response = () => ({ ok: true, json: async () => [row] })

    pending[2].resolve(response())
    pending[3].resolve(response())
    await new Promise((resolve) => setImmediate(resolve))

    // The startup loads finish late: one succeeds and one fails.
    pending[0].reject(new Error('stale request failed'))
    pending[1].resolve(response())
    await new Promise((resolve) => setImmediate(resolve))

    for (const id of ['next-month-event-list', 'current-month-event-list']) {
      const list = document.getElementById(id)
      assert.equal(list.children.length, 1)
      assert.match(list.textContent, /^NEW .*Race test$/)
      assert.doesNotMatch(list.textContent, /could not be loaded/)
    }
  } finally {
    globalThis.window = previous.window
    globalThis.document = previous.document
    globalThis.fetch = previous.fetch
    dom.window.close()
  }
})
