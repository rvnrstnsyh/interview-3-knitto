import Http from '../../../../helpers/classes/Http.ts'
import TaskSchedulerValidationSchema from '../../../../helpers/functions/payload-validations/task-scheduler.ts'

import type { FreshContext } from '$fresh/server.ts'

const SUPPORTED_CT: readonly string[] = ['application/x-www-form-urlencoded', 'application/json'] as const

type SupportedContentType = typeof SUPPORTED_CT[number]

export async function handler(request: Request, ctx: FreshContext): Promise<Response> {
	const contentType: SupportedContentType | null = request.headers.get('Content-Type') as SupportedContentType | null

	switch (request.method) {
		case 'OPTIONS': {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Allow-Methods': 'HEAD, OPTIONS, POST, GET, DELETE',
				},
			})
		}
		case 'POST':
		case 'GET':
		case 'DELETE': {
			if (request.method === 'POST' && (!contentType || !SUPPORTED_CT.includes(contentType))) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					message: '-ERR unsupported or missing content-type',
				}))
			}

			try {
				if (request.method === 'POST') {
					const payload: HttpPayload = await Http.payloadExtractor(request, ctx, SUPPORTED_CT)

					if (typeof payload !== 'object' || Object.keys(payload).length <= 0) {
						return Http.json(Http.data({
							success: false,
							code: 400,
							message: '-ERR no data provided',
						}))
					}

					const validation: ReturnType<typeof Http.data> = Http.validator(TaskSchedulerValidationSchema, payload)

					if (validation.success && validation.data) {
						ctx.state.taskData = validation.data
					} else {
						return Http.json(validation)
					}
				}

				const response = await ctx.next()
				const responseData = await response.json()
				return Http.responder(contentType || 'application/json', responseData)
			} catch (error) {
				console.error('Error processing request:', error)
				return Http.json(Http.data({
					success: false,
					code: 500,
					message: `-ERR processing request: ${error instanceof Error ? error.message : 'unknown error'}`,
				}))
			}
		}
		default: {
			return Http.json(Http.data({
				success: false,
				code: 405,
				message: '-ERR method not allowed',
			}))
		}
	}
}
