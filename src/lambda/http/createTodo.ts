import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodoItem } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Creating a todo item: ', { event })

  const userId = getUserId(event)
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newItem = await createTodoItem(userId, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
