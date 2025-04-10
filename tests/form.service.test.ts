import expect from 'expect'
import prisma from '../src/db/db_client'
import {
  createForm,
  getAllForms,
  getFormById,
} from '../src/services/formService'
import { ServiceError } from '../src/errors'

describe('Form Service', () => {
  const mockForm = {
    id: '123',
    name: 'Test Form',
    fields: [],
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('getFormById', () => {
    it('should return form when found', async () => {
      const spy = jest
        .spyOn(prisma.form, 'findUniqueOrThrow')
        .mockResolvedValue(mockForm)

      const result = await getFormById('123')

      expect(spy).toHaveBeenCalledWith({ where: { id: '123' } })
      expect(result).toEqual(mockForm)
    })

    it('should throw ServiceError on failure', async () => {
      jest
        .spyOn(prisma.form, 'findUniqueOrThrow')
        .mockRejectedValue(new Error('DB error'))

      await expect(getFormById('123')).rejects.toThrow(ServiceError)
      await expect(getFormById('123')).rejects.toThrow('failed to fetch form')
    })
  })

  describe('getAllForms', () => {
    it('should return all forms', async () => {
      const spy = jest
        .spyOn(prisma.form, 'findMany')
        .mockResolvedValue([mockForm])

      const result = await getAllForms()

      expect(spy).toHaveBeenCalled()
      expect(result).toEqual([mockForm])
    })

    it('should throw ServiceError on failure', async () => {
      jest
        .spyOn(prisma.form, 'findMany')
        .mockRejectedValue(new Error('DB error'))

      await expect(getAllForms()).rejects.toThrow(ServiceError)
      await expect(getAllForms()).rejects.toThrow('failed to fetch forms')
    })
  })

  describe('createForm', () => {
    it('should create and return new form', async () => {
      const spy = jest.spyOn(prisma.form, 'create').mockResolvedValue(mockForm)

      const result = await createForm('Test Form', [])

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Test Form',
            fields: [],
          }),
        })
      )
      expect(result).toEqual(mockForm)
    })

    it('should throw ServiceError on failure', async () => {
      jest
        .spyOn(prisma.form, 'create')
        .mockRejectedValue(new Error('Create error'))

      await expect(createForm('Fail Form', [])).rejects.toThrow(ServiceError)
      await expect(createForm('Fail Form', [])).rejects.toThrow(
        'failed to create form'
      )
    })
  })
})
