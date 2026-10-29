const ENDPOINT = 'https://firestore.googleapis.com/v1/projects/lansing-codes/databases/(default)/documents:runQuery'

export function eventQuery(startTime, endTime) {
  const timeFilter = (op, value) => ({
    fieldFilter: {
      field: { fieldPath: 'startTime' },
      op,
      value: { integerValue: String(value) },
    },
  })
  return {
    structuredQuery: {
      from: [{ collectionId: 'events' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            timeFilter('GREATER_THAN_OR_EQUAL', startTime),
            timeFilter('LESS_THAN_OR_EQUAL', endTime),
          ],
        },
      },
      orderBy: [{ field: { fieldPath: 'startTime' }, direction: 'ASCENDING' }],
    },
  }
}

export async function fetchEvents(startTime, endTime, fetchImpl = fetch) {
  const response = await fetchImpl(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventQuery(startTime, endTime)),
  })
  if (!response.ok) throw new Error(`Firestore request failed: ${response.status}`)
  const rows = await response.json()
  return rows.flatMap(({ document }) => {
    if (!document) return []
    const { name, url, startTime: start } = document.fields || {}
    const startTimeValue = Number(start?.integerValue)
    if (!Number.isFinite(startTimeValue)) return []
    return [{ name: name?.stringValue || '', url: url?.stringValue || '', startTime: startTimeValue }]
  })
}
