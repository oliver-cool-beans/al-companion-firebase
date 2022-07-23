import * as express from 'express'
import * as cors from 'cors'
import _schema from '../types/_schema'
import { validateAuthToken, validateBody } from './middleware'
import characterRoutes from './routes/character'

const app = express()

app.use(cors({ origin: true }))

// Endpoints
app.use('/v1/:owner/character', validateAuthToken, validateBody(_schema.CharacterRequest), characterRoutes)

export default app
