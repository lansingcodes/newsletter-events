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

const firstOfNextMonth = moment().add(1, 'month').startOf('month').startOf('day')
const endOfNextMonth = moment(firstOfNextMonth).endOf('month').endOf('day')
const eventList = document.getElementById('event-list')

document.getElementById('month').innerHTML = firstOfNextMonth.format('MMMM')

firestore
  .collection('events')
  .where('startTime', '>=', firstOfNextMonth.valueOf())
  .where('startTime', '<=', endOfNextMonth.valueOf())
  .orderBy('startTime', 'asc')
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const event = doc.data()
      const when = moment(event.startTime).format('ddd. MMM. D [at] h:mm')
      const link = `<a href="${event.url}">${event.name}</a>`
      const li = document.createElement('li')
      li.innerHTML = `${when} - ${link}`
      eventList.appendChild(li)
    })
  })
