import { SourceRecord } from '@prisma/client'
import prisma from '../db/db_client'
import { randomUUID } from 'crypto'
import { ServiceError } from '../errors'

export async function createSourceRecord(
  sourceRecord: SourceRecord
): Promise<SourceRecord> {
  try {
    const newUUID = randomUUID()

    return await prisma.sourceRecord.create({
      data: {
        id: newUUID,
        formId: sourceRecord.formId,
        sourceData: { create: sourceRecord['sourceData'] },
      },
      include: {
        sourceData: true,
      },
    })
  } catch (err: any) {
    throw new ServiceError('failed to create source record', err)
  }
}

export async function getSourceRecordsByFormId(
  formId: string
): Promise<SourceRecord[]> {
  try {
    return await prisma.sourceRecord.findMany({
      where: { formId },
      include: { sourceData: true },
    })
  } catch (err: any) {
    throw new ServiceError('failed to fetch source records')
  }
}
