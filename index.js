import { fetchEvents } from './events.js'
import { appendEvent } from './render.js'
import { buildNewsletterEmail } from './email-template.js'

const moment = window.moment
const LANSING_TIME_ZONE = 'America/Detroit'
const latestLoadByList = new Map()
const emailMonths = new Map()
let emailContent = null

function refreshEmailPreview () {
  const status = document.getElementById('email-status')
  const copy = document.getElementById('copy-email')
  const download = document.getElementById('download-email')
  const months = ['current-month-event-list', 'next-month-event-list']
    .map(id => emailMonths.get(id))

  if (months.some(month => month?.status === 'error')) {
    status.textContent = 'The email preview is unavailable because events could not be loaded.'
  } else if (months.some(month => month?.status !== 'ready')) {
    status.textContent = 'Loading events for the email preview…'
  } else {
    emailContent = buildNewsletterEmail(months)
    document.getElementById('email-preview').srcdoc = emailContent.html
    copy.disabled = false
    download.disabled = false
    status.textContent = 'Email preview ready. Copy it into Mailchimp or download the HTML.'
    return
  }
  emailContent = null
  document.getElementById('email-preview').srcdoc = ''
  copy.disabled = true
  download.disabled = true
}

async function compileEventList(monthMoment, nameId, listId) {
  const loadId = (latestLoadByList.get(listId) || 0) + 1
  latestLoadByList.set(listId, loadId)
  const dateFormat = document.getElementById('date-format').value
  const firstOfMonth = monthMoment.clone().startOf('month')
  const endOfMonth = monthMoment.clone().endOf('month')

  const monthNameEl = document.getElementById(nameId)
  monthNameEl.textContent = firstOfMonth.format('MMMM')

  const eventListEl = document.getElementById(listId)
  eventListEl.replaceChildren()
  emailMonths.set(listId, { status: 'loading' })
  refreshEmailPreview()

  try {
    const events = await fetchEvents(firstOfMonth.valueOf(), endOfMonth.valueOf())
    if (latestLoadByList.get(listId) !== loadId) return
    const emailEvents = []
    for (const event of events) {
      const when = moment.tz(event.startTime, LANSING_TIME_ZONE).format(dateFormat).replace(':00', '')
      appendEvent(eventListEl, event, when)
      emailEvents.push({ event, when })
    }
    emailMonths.set(listId, { status: 'ready', title: firstOfMonth.format('MMMM YYYY'), events: emailEvents })
    refreshEmailPreview()
  } catch (error) {
    if (latestLoadByList.get(listId) !== loadId) return
    const message = document.createElement('li')
    message.textContent = 'Events could not be loaded. Please try again.'
    eventListEl.append(message)
    emailMonths.set(listId, { status: 'error' })
    refreshEmailPreview()
    console.error('Failed to load newsletter events:', error)
  }
}

function refreshEventLists() {
  compileEventList(moment.tz(LANSING_TIME_ZONE).add(1, 'month'), 'next-month-name', 'next-month-event-list')
  compileEventList(moment.tz(LANSING_TIME_ZONE), 'current-month-name', 'current-month-event-list')
}

document.getElementById('refresh-format').addEventListener('click', refreshEventLists)
document.getElementById('copy-email').addEventListener('click', async () => {
  if (!emailContent) return
  const content = emailContent
  try {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([content.html], { type: 'text/html' }),
      'text/plain': new Blob([content.text], { type: 'text/plain' }),
    })])
    if (emailContent === content) document.getElementById('email-status').textContent = 'Formatted email copied.'
  } catch {
    if (emailContent === content) document.getElementById('email-status').textContent = 'Clipboard access failed. Use Download HTML instead.'
  }
})
document.getElementById('download-email').addEventListener('click', () => {
  if (!emailContent) return
  const url = URL.createObjectURL(new Blob([emailContent.html], { type: 'text/html;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'lansing-codes-newsletter.html'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 60000)
})
refreshEventLists()
