import { fetchEvents } from './events.js'
import { appendEvent } from './render.js'

const moment = window.moment
const LANSING_TIME_ZONE = 'America/Detroit'
const latestLoadByList = new Map()

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

  try {
    const events = await fetchEvents(firstOfMonth.valueOf(), endOfMonth.valueOf())
    if (latestLoadByList.get(listId) !== loadId) return
    for (const event of events) {
      const when = moment.tz(event.startTime, LANSING_TIME_ZONE).format(dateFormat).replace(':00', '')
      appendEvent(eventListEl, event, when)
    }
  } catch (error) {
    if (latestLoadByList.get(listId) !== loadId) return
    const message = document.createElement('li')
    message.textContent = 'Events could not be loaded. Please try again.'
    eventListEl.append(message)
    console.error('Failed to load newsletter events:', error)
  }
}

function refreshEventLists() {
  compileEventList(moment.tz(LANSING_TIME_ZONE).add(1, 'month'), 'next-month-name', 'next-month-event-list')
  compileEventList(moment.tz(LANSING_TIME_ZONE), 'current-month-name', 'current-month-event-list')
}

document.getElementById('refresh-format').addEventListener('click', refreshEventLists)
refreshEventLists()
