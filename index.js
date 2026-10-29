import { fetchEvents } from './events.js'
import { appendEvent } from './render.js'

const moment = window.moment

async function compileEventList(monthMoment, nameId, listId) {
  const dateFormat = document.getElementById('date-format').value
  const firstOfMonth = monthMoment.startOf('month').startOf('day')
  const endOfMonth = moment(firstOfMonth).endOf('month').endOf('day')

  const monthNameEl = document.getElementById(nameId)
  monthNameEl.textContent = firstOfMonth.format('MMMM')

  const eventListEl = document.getElementById(listId)
  eventListEl.replaceChildren()

  try {
    const events = await fetchEvents(firstOfMonth.valueOf(), endOfMonth.valueOf())
    for (const event of events) {
      const when = moment(event.startTime).format(dateFormat).replace(':00', '')
      appendEvent(eventListEl, event, when)
    }
  } catch (error) {
    const message = document.createElement('li')
    message.textContent = 'Events could not be loaded. Please try again.'
    eventListEl.append(message)
    console.error('Failed to load newsletter events:', error)
  }
}

function refreshEventLists() {
  compileEventList(moment().add(1, 'month'), 'next-month-name', 'next-month-event-list')
  compileEventList(moment(), 'current-month-name', 'current-month-event-list')
}

document.getElementById('refresh-format').addEventListener('click', refreshEventLists)
refreshEventLists()
