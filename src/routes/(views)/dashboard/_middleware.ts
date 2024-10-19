import type { FreshContext } from '$fresh/server.ts'

import { Payload, verify } from 'djwt'
import { load } from '$std/dotenv/mod.ts'
import { deleteCookie, getCookies } from '$std/http/cookie.ts'

const env: Record<string, string> = await load({ envPath: '.env', export: true })

export async function handler(request: Request, ctx: FreshContext): Promise<Response> {
	switch (request.method) {
		case 'OPTIONS': {
			return new Response(null, {
				status: 204,
				headers: {
					'Access-Control-Allow-Credentials': 'true',
					'Access-Control-Allow-Headers': 'Content-Type',
					'Access-Control-Allow-Methods': 'HEAD, OPTIONS, GET',
				},
			})
		}
		case 'GET': {
			try {
				const cookies: Record<string, string> = getCookies(request.headers)
				const session: string = cookies.session
				const secretKey: CryptoKey = await crypto.subtle.importKey(
					'raw',
					new TextEncoder().encode(env['JWT_SECRET']),
					{ name: 'HMAC', hash: 'SHA-256' },
					true,
					['verify'],
				)

				if (!session) return new Response(null, { status: 303, headers: { 'Location': '/' } })

				try {
					ctx.state.user = await verify(session, secretKey) as Payload
				} catch (_error) {
					const headers: Headers = new Headers()
					headers.set('Location', '/')
					deleteCookie(headers, 'session', { path: '/' })
					return new Response(null, { status: 303, headers: headers })
				}

				return await ctx.next()
			} catch (error) {
				return new Response(`-ERR processing request: ${error instanceof Error ? error.message : 'unknown error'}`, { status: 500 })
			}
		}
		default: {
			return new Response('-ERR 405 method not allowed', { status: 405 })
		}
	}
}
