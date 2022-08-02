import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {TodoUpdate} from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import 'source-map-support/register'

// TODO: Implement businessLogic
const logger = createLogger('todos')
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function getAllTodoItems(userId: string): Promise<TodoItem[]>{
    logger.info(`Getting todos for user ${userId}`, {userId})

    const items = await todosAccess.getTodoItems(userId)
    // for(const item of items){
    //     const todoId = item.todoId
    //     if(todoId && (await attachmentUtils.fileExists(todoId))){
    //         item.attachmentUrl = attachmentUtils.getDownloadUrl(todoId)
    //     }
    // }
    return items
}

export async function createTodoItem(userId: string, createTodoRequest: CreateTodoRequest): Promise<TodoItem> {
    const todoId = uuid.v4()

    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...createTodoRequest
    }

    logger.info(`Creating todo ${todoId} for user ${userId}`, { userId, todoId, todoItem: newItem })

    await todosAccess.createTodoItem(newItem)

    return newItem
}


export async function updateTodo(userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest) {
    logger.info(`Updating todo ${todoId} for user ${userId}`, { userId, todoId, todoUpdate: updateTodoRequest })

    const item = await todosAccess.getTodoItem(userId, todoId)

    if (!item)
        throw createError(404, "Todo item not found!")

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
        throw createError(403, "User is not authorized to update item")
    }

    todosAccess.updateTodoItem(userId, todoId, updateTodoRequest as TodoUpdate)
}


export async function deleteTodo(userId: string, todoId: string) {
    logger.info(`Deleting todo ${todoId} for user ${userId}`, { userId, todoId })

    const item = await todosAccess.getTodoItem(userId, todoId)

    if (!item)
        throw createError(404, "Todo item not found!")

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to delete todo ${todoId}`)
        throw createError(403, "User is not authorized to delete item!")
    }

    todosAccess.deleteTodoItem(userId, todoId)
}


export async function updateAttachmentUrl(userId: string, todoId: string, attachmentId: string) {
    logger.info(`Generating attachment URL for attachment ${attachmentId}`)

    const attachmentUrl = await attachmentUtils.getAttachmentUrl(attachmentId)

    logger.info(`Updating todo ${todoId} with attachment URL ${attachmentUrl}`, { userId, todoId })

    const item = await todosAccess.getTodoItem(userId, todoId)

    if (!item)
        throw createError(404, "Todo item not found!")

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update todo ${todoId}`)
        throw createError(403, "User is not authorized to update item!")
    }

    await todosAccess.updateAttachmentUrl(userId, todoId, attachmentUrl)
}


export async function createAttachmentPresignedUrl(attachmentId: string): Promise<string> {
    logger.info(`Generating upload URL for attachment ${attachmentId}`)

    const uploadUrl = await attachmentUtils.getUploadUrl(attachmentId)

    return uploadUrl
}