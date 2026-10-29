export function appendEvent(list, event, when, doc = document) {
  const li = doc.createElement('li')
  const time = doc.createElement('code')
  time.textContent = when
  li.append(time, ' - ')

  let url
  try {
    url = new URL(event.url)
  } catch {
    // Keep the event name visible even if the stored URL is invalid.
  }

  if (url && ['http:', 'https:'].includes(url.protocol)) {
    const link = doc.createElement('a')
    link.href = url.href
    link.textContent = event.name || 'Unnamed event'
    li.append(link)
  } else {
    li.append(doc.createTextNode(event.name || 'Unnamed event'))
  }
  list.append(li)
}
