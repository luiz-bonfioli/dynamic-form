import { FastifyInstance } from 'fastify'

import { Form, Prisma } from '@prisma/client'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ApiError } from '../errors'
import { randomUUID } from 'crypto'
import { StatusCodes } from '../status'

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
        const form = await prisma.form.findUniqueOrThrow({ where: { id } })
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
        const forms = await prisma.form.findMany()
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
        const createdForm = (await prisma.form.create({
          data: {
            id: randomUUID(),
            name,
            fields: fields as Prisma.InputJsonValue,
          },
        })) as Form
        reply.status(StatusCodes.created).send(createdForm)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create form')
      }
    },
  })
}

export default formRoutes
