import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
import moment from 'moment-timezone'

test('a pending clipboard result cannot replace a newer preview status', async () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const dom = new JSDOM(html, { url: 'http://localhost/' })
  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    fetch: globalThis.fetch,
    ClipboardItem: globalThis.ClipboardItem,
  }
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  let completeCopy
  let failLoads = false

  try {
    globalThis.window = dom.window
    globalThis.document = dom.window.document
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { write: () => new Promise(resolve => { completeCopy = resolve }) } },
    })
    globalThis.ClipboardItem = class { constructor (items) { this.items = items } }
    window.moment = moment
    globalThis.fetch = async () => {
      if (failLoads) throw new Error('refresh failed')
      return { ok: true, json: async () => [] }
    }

    await import(`../index.js?clipboard-test=${Date.now()}`)
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(document.getElementById('copy-email').disabled, false)

    document.getElementById('copy-email').click()
    failLoads = true
    document.getElementById('refresh-format').click()
    await new Promise(resolve => setImmediate(resolve))
    const status = document.getElementById('email-status')
    assert.match(status.textContent, /unavailable/)
    completeCopy()
    await new Promise(resolve => setImmediate(resolve))
    assert.match(status.textContent, /unavailable/)
    assert.equal(document.getElementById('download-email').disabled, true)
  } finally {
    Object.assign(globalThis, previous)
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor)
    else delete globalThis.navigator
    dom.window.close()
  }
})
