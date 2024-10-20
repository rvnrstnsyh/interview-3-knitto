import Http from '../../../../helpers/classes/Http.ts'
import { FreshContext, Handlers } from '$fresh/server.ts'

// Simulasi penyimpanan task in-memory
const tasks = new Map<string, { cron: string; taskName: string }>()

export const handler: Handlers = {
	POST(_request: Request, ctx: FreshContext): Promise<Response> | Response {
		const { taskId, cron, taskName } = ctx.state.taskData as { taskId: string; cron: string; taskName: string }

		if (tasks.has(taskId)) {
			return Http.json(Http.data({
				success: false,
				code: 409,
				type: 'task-scheduler',
				message: '-ERR task with this ID already exists',
			}))
		}

		tasks.set(taskId, { cron, taskName })

		return Http.json(Http.data({
			success: true,
			code: 201,
			type: 'task-scheduler',
			message: '+OK task scheduled successfully',
			data: { taskId, cron, taskName },
		}))
	},

	GET(_request: Request, _ctx: FreshContext): Promise<Response> | Response {
		const taskList = Array.from(tasks.entries()).map(([id, task]) => ({
			taskId: id,
			...task,
		}))

		return Http.json(Http.data({
			success: true,
			code: 200,
			type: 'task-scheduler',
			message: '+OK tasks retrieved successfully',
			data: { tasks: taskList },
		}))
	},

	DELETE(_request: Request, ctx: FreshContext): Promise<Response> | Response {
		const taskId = ctx.params.taskId

		if (!tasks.has(taskId)) {
			return Http.json(Http.data({
				success: false,
				code: 404,
				type: 'task-scheduler',
				message: '-ERR task not found',
			}))
		}

		tasks.delete(taskId)

		return Http.json(Http.data({
			success: true,
			code: 200,
			type: 'task-scheduler',
			message: '+OK task deleted successfully',
			data: { taskId },
		}))
	},
}
