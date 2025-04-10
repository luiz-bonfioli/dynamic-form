import { FastifyInstance } from 'fastify'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import { ApiError } from '../errors'
import { StatusCodes } from '../status'
import { SourceRecord } from '@prisma/client'
import { IEntityId } from './schemas/common'
import { randomUUID } from 'crypto'

async function sourceRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formRoutes' })

  app.post<{
    Body: SourceRecord
    Reply: SourceRecord
  }>('/', {
    async handler(req, reply) {
      log.debug('creating new source record')
      try {
        const sourceRecord = req.body
        const newUUID = randomUUID()

        const sourceRecordCreated = await prisma.sourceRecord.create({
          data: {
            id: newUUID,
            formId: sourceRecord.formId,
            sourceData: { create: sourceRecord['sourceData'] },
          },
          include: {
            sourceData: true,
          },
        })

        reply.status(StatusCodes.created).send(sourceRecordCreated)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create source record', err)
      }
    },
  })

  app.get<{
    Params: IEntityId
    Reply: SourceRecord[]
  }>('/:id', {
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get source record by form id')
      try {
        const sourceRecords = await prisma.sourceRecord.findMany({
          where: { formId: id },
          include: { sourceData: true },
        })

        reply.send(sourceRecords)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch source records')
      }
    },
  })
}

export default sourceRoutes
