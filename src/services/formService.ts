import { Form, Prisma } from '@prisma/client'
import prisma from '../db/db_client'
import { ServiceError } from '../errors'
import { randomUUID } from 'crypto'

export async function getFormById(id: string): Promise<Form> {
  try {
    return await prisma.form.findUniqueOrThrow({ where: { id } })
  } catch (err: any) {
    throw new ServiceError('failed to fetch form', err)
  }
}

export async function getAllForms(): Promise<Form[]> {
  try {
    return await prisma.form.findMany()
  } catch (err: any) {
    throw new ServiceError('failed to fetch forms', err)
  }
}

export async function createForm(name: string, fields): Promise<Form> {
  try {
    return (await prisma.form.create({
      data: {
        id: randomUUID(),
        name,
        fields: fields as Prisma.InputJsonValue,
      },
    })) as Form
  } catch (err: any) {
    throw new ServiceError('failed to create form', err)
  }
}
