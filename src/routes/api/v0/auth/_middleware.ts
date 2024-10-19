import Http from '../../../../helpers/classes/Http.ts'
import AuthValidationSchema from '../../../../helpers/functions/payload-validations/auth.ts'

import type { FreshContext } from '$fresh/server.ts'

import { deleteCookie } from '$std/http/cookie.ts'

const SUPPORTED_CT: readonly string[] = ['application/x-www-form-urlencoded', 'application/json']

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
					'Access-Control-Allow-Methods': 'HEAD, OPTIONS, GET, POST',
				},
			})
		}
		case 'GET': {
			const headers: Headers = new Headers()
			headers.set('Location', '/')
			deleteCookie(headers, 'session', { path: '/' })
			return new Response(null, { status: 200, headers: headers })
		}
		case 'POST': {
			if (!contentType || !SUPPORTED_CT.includes(contentType)) return new Response('-ERR unsupported or missing content-type', { status: 400 })

			try {
				const payload: HttpPayload = await Http.payloadExtractor(request, ctx, SUPPORTED_CT)

				if (typeof payload !== 'object' || Object.keys(payload).length <= 0) return new Response('-ERR no data provided', { status: 400 })

				const validation: ReturnType<typeof Http.data> = Http.validator(AuthValidationSchema, payload)

				if (validation.success && validation.data?.email) {
					if (validation.success) {
						ctx.state.remoteIp = validation.data.remoteIp
						ctx.state.email = validation.data.email
						ctx.state.password = validation.data.password

						Object.assign(validation, await (await ctx.next()).json())
					}
				}

				return Http.responder(contentType, validation)
			} catch (error) {
				return new Response(`-ERR processing request: ${error instanceof Error ? error.message : 'unknown error'}`, { status: 500 })
			}
		}
		default: {
			return new Response('-ERR 405 method not allowed', { status: 405 })
		}
	}
}
