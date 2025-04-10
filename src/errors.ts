import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const errorHandler = (error: any, req: any, reply: any) => {
  if (error.statusCode) {
    reply.code(error.statusCode)
  }
  if (error instanceof PrismaClientKnownRequestError) {
    reply.code(StatusCodes.notFound)
  }
  reply.send(error)
  return
}
export default errorHandler

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
  }
}

export class ServiceError extends Error {
  constructor(message: string, error?: any) {
    const fullMessage = `${message}${
      error?.message ? `: ${error.message}` : ''
    }`
    super(fullMessage)
  }
}

export const StatusCodes = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  unexpected: 500,
}
