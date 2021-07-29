/* global firebase, moment */
const firebaseConfig = {
  apiKey: 'AIzaSyCMw8mZ1D1GAYpeotAqVCaYAMtn3URVOok',
  authDomain: 'lansing-codes.firebaseapp.com',
  databaseURL: 'https://lansing-codes.firebaseio.com',
  projectId: 'lansing-codes',
  storageBucket: 'lansing-codes.appspot.com',
  messagingSenderId: '647280182517',
  appId: '1:647280182517:web:779f72d0b90c0dd4'
}
const firestore = firebase.initializeApp(firebaseConfig).firestore()

function compileEventList (monthMoment, nameId, listId) {
  const dateFormat = document.getElementById('date-format').value
  const firstOfMonth = monthMoment.startOf('month').startOf('day')
  const endOfMonth = moment(firstOfMonth).endOf('month').endOf('day')

  const monthNameEl = document.getElementById(nameId)
  monthNameEl.innerHTML = firstOfMonth.format('MMMM')

  const eventListEl = document.getElementById(listId)
  eventListEl.innerHTML = ''

  firestore
    .collection('events')
    .where('startTime', '>=', firstOfMonth.valueOf())
    .where('startTime', '<=', endOfMonth.valueOf())
    .orderBy('startTime', 'asc')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const event = doc.data()
        const when = moment(event.startTime)
          .format(dateFormat)
          .replace(':00', '')
        const link = `<a href="${event.url}">${event.name}</a>`
        const li = document.createElement('li')
        li.innerHTML = `<code>${when}</code> - ${link}`
        eventListEl.appendChild(li)
      })
    })
}

function refreshEventLists () {
  compileEventList(
    moment().add(1, 'month'),
    'next-month-name',
    'next-month-event-list'
  )
  compileEventList(
    moment(),
    'current-month-name',
    'current-month-event-list'
  )
}

const refreshFormatButton = document.getElementById('refresh-format')
refreshFormatButton.addEventListener('click', refreshEventLists)

refreshEventLists()
