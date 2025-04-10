import { FastifyInstance } from 'fastify'
import { serializer } from './middleware/pre_serializer'
import { StatusCodes } from '../status'
import { SourceRecord } from '@prisma/client'
import { IEntityId } from './schemas/common'
import {
  createSourceRecord,
  getSourceRecordsByFormId,
} from '../services/sourceService'

async function sourceRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'sourceRoutes' })

  app.post<{
    Body: SourceRecord
    Reply: SourceRecord
  }>('/', {
    async handler(req, reply) {
      log.debug('creating new source record')
      const created = await createSourceRecord(req.body)
      reply.status(StatusCodes.created).send(created)
    },
  })

  app.get<{
    Params: IEntityId
    Reply: SourceRecord[]
  }>('/:id', {
    async handler(req, reply) {
      const { id } = req.params
      log.debug('get source record by form id')
      const records = await getSourceRecordsByFormId(id)
      reply.send(records)
    },
  })
}

export default sourceRoutes
