import prisma from '../src/db/db_client'
import {
  createSourceRecord,
  getSourceRecordsByFormId,
} from '../src/services/sourceService'
import { ServiceError } from '../src/errors'

describe('SourceRecord Service', () => {
  const mockSourceRecord = {
    id: 'abc-uuid',
    formId: 'form-123',
    sourceData: [{ id: 'data-1', value: 'test' }],
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('createSourceRecord', () => {
    it('should create and return a source record', async () => {
      const spy = jest
        .spyOn(prisma.sourceRecord, 'create')
        .mockResolvedValue(mockSourceRecord as any)

      const input = {
        formId: 'form-123',
        sourceData: [{ value: 'test' }],
      }

      const result = await createSourceRecord(input as any)

      expect(spy).toHaveBeenCalledWith({
        data: expect.objectContaining({
          formId: 'form-123',
          sourceData: { create: input.sourceData },
        }),
        include: { sourceData: true },
      })

      expect(result).toEqual(mockSourceRecord)
    })

    it('should throw ServiceError on failure', async () => {
      jest
        .spyOn(prisma.sourceRecord, 'create')
        .mockRejectedValue(new Error('DB error'))

      await expect(createSourceRecord({} as any)).rejects.toThrow(ServiceError)
      await expect(createSourceRecord({} as any)).rejects.toThrow(
        'failed to create source record'
      )
    })
  })

  describe('getSourceRecordsByFormId', () => {
    it('should return records by formId', async () => {
      const spy = jest
        .spyOn(prisma.sourceRecord, 'findMany')
        .mockResolvedValue([mockSourceRecord] as any)

      const result = await getSourceRecordsByFormId('form-123')

      expect(spy).toHaveBeenCalledWith({
        where: { formId: 'form-123' },
        include: { sourceData: true },
      })

      expect(result).toEqual([mockSourceRecord])
    })

    it('should throw ServiceError on failure', async () => {
      jest
        .spyOn(prisma.sourceRecord, 'findMany')
        .mockRejectedValue(new Error('DB error'))

      await expect(getSourceRecordsByFormId('form-123')).rejects.toThrow(
        ServiceError
      )
      await expect(getSourceRecordsByFormId('form-123')).rejects.toThrow(
        'failed to fetch source records'
      )
    })
  })
})
