import * as express from 'express'
import { submitCharacterData } from '../../jobs/character'

const route = express.Router({ mergeParams: true })

route.post('/', async (request: express.Request, response: express.Response) => {
  const { owner } = request.params
  try {
    await submitCharacterData(request.db, request.body, owner)
  } catch (error: any) {
    if (!error?.message || !error.status || !error.code) return response.status(500).send('Server Error')
    return response.status(error.status).send(error)
  }

  return response.status(200).send('OK')
})

export default route
