import { FastifyInstance } from 'fastify'

import { Form } from '@prisma/client'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ApiError } from '../errors'
import { StatusCodes } from '../status'
import { createForm, getAllForms, getFormById } from '../services/formService'

async function formRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formRoutes' })

  app.get<{
    Params: IEntityId
    Reply: Form
  }>('/:id', {
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get form by id')
      try {
        const form = await getFormById(id)
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch form')
      }
    },
  })

  app.get<{
    Reply: Form[]
  }>('/', {
    async handler(_req, reply) {
      log.debug('get all forms')
      try {
        const forms = await getAllForms()
        reply.send(forms)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch forms')
      }
    },
  })

  app.post<{
    Body: Form
    Reply: Form
  }>('/', {
    async handler(req, reply) {
      log.debug('creating new form')
      try {
        const { name, fields } = req.body
        reply.status(StatusCodes.created).send(await createForm(name, fields))
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create form')
      }
    },
  })
}

export default formRoutes
