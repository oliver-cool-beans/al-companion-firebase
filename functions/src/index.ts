import * as functions from 'firebase-functions'

export const api = functions
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onRequest(async (request, response) => {
    await (await import('./http')).default(request, response)
  })
