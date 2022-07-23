import Ajv from 'ajv'
import * as express from 'express'
import * as admin from 'firebase-admin'
const ajv = new Ajv({ allErrors: true })

admin.initializeApp()

export const validateAuthToken = async (request: express.Request, response: express.Response, next: () => any) => {
  const db = admin.database()

  const apiKey = request.headers['x-api-key']
  const { owner } = request.params

  const keyRef = db.ref(`keys/${owner}/auth`)

  const payload = await keyRef.once('value')

  if (!payload.val()) {
    return response.status(401).send({
      message: `Owner not configured - ${owner}`,
      status: 401,
      code: 'authentication-error'
    })
  }

  if (!apiKey || payload.val() !== apiKey) {
    return response.status(401).send({
      message: 'Unauthorized: Authorize your request - invalid x-api-key>',
      code: 'authentication-error'
    })
  }

  request.db = db
  return next()
}

export function validateBody (schema) {
  const validate = ajv.compile(schema)
  return (req, res, next) => {
    if (!validate(req.body)) return res.status(400).json(validate.errors)
    return next()
  }
}
