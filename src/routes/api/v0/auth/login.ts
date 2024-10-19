import Http from '../../../../helpers/classes/Http.ts'

import { create } from 'djwt'
import { compare } from 'bcrypt'
import { load } from '$std/dotenv/mod.ts'
import { FreshContext, Handlers } from '$fresh/server.ts'
import { sql } from '../../../../helpers/functions/mysql.ts'

const env: Record<string, string> = await load({ envPath: '.env', export: true })

export const handler: Handlers = {
	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { email, password } = ctx.state as { email: string; password: string }

		try {
			const [user] = await sql.query('SELECT id, email, password FROM users WHERE email = ? LIMIT 1', [email])

			if (!user) {
				return Http.json(Http.data({
					success: false,
					code: 404,
					type: 'login',
					message: '-ERR user not found',
					data: { email },
				}))
			}

			if (!await compare(password, user.password)) {
				return Http.json(Http.data({
					success: false,
					code: 401,
					type: 'login',
					message: '-ERR incorrect password',
					data: { email },
				}))
			}

			const jwtPayload = {
				id: user.id,
				email: user.email,
			}
			const jwtToken = await create(
				{ alg: 'HS256', typ: 'JWT' },
				jwtPayload,
				await crypto.subtle.importKey(
					'raw',
					new TextEncoder().encode(env['JWT_SECRET']),
					{ name: 'HMAC', hash: 'SHA-256' },
					true,
					['sign'],
				),
			)

			return Http.json(Http.data({
				success: true,
				code: 200,
				type: 'login',
				message: '+OK login successful',
				data: {
					email,
					session: jwtToken,
				},
			}))
		} catch (error) {
			return Http.json(Http.data({
				success: false,
				code: 500,
				type: 'login',
				message: `-ERR ${error instanceof Error ? error.message : 'unknown error'}`,
			}))
		}
	},
}
