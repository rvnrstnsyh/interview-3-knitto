import Http from '../../../../helpers/classes/Http.ts'

import { hash } from 'bcrypt'
import { FreshContext, Handlers } from '$fresh/server.ts'
import { sql } from '../../../../helpers/functions/mysql.ts'

export const handler: Handlers = {
	async POST(_request: Request, ctx: FreshContext): Promise<Response> {
		const { email, password } = ctx.state as { email: string; password: string }
		const currentTime: number = Math.trunc(Date.now() / 1000)

		try {
			const [userExists] = await sql.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email])

			if (userExists) {
				return Http.json(Http.data({
					success: false,
					code: 400,
					type: 'register',
					message: '-ERR user already exists',
					data: { email },
				}))
			}

			await sql.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, await hash(password)])

			return Http.json(Http.data({
				success: true,
				code: 202,
				type: 'register',
				message: '+OK user created successfully',
				data: {
					email,
					timestamp: currentTime,
				},
			}))
		} catch (error) {
			return Http.json(Http.data({
				success: false,
				code: 500,
				type: 'register',
				message: `-ERR ${error instanceof Error ? error.message : 'unknown error'}`,
			}))
		}
	},
}
