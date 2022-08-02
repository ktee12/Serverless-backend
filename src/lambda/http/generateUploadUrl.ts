import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createAttachmentPresignedUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('generateUploadUrl')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Generating upload url: ', { event })

  const userId = getUserId(event)
  const todoId = event.pathParameters.todoId
  const attachmentId = uuid.v4()

  const uploadUrl = await createAttachmentPresignedUrl(attachmentId)

  await updateAttachmentUrl(userId, todoId, attachmentId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}
