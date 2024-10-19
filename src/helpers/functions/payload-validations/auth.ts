import { z } from 'zod'

export const schema = z.object({
	remoteIp: z.string().ip(),
	email: z.string().email(),
	password: z.string().min(8),
	confirm_password: z.string().optional(),
}).refine((data) => !data.confirm_password || data.password === data.confirm_password, {
	message: "Passwords don't match",
	path: ['confirm_password'],
})

export type AuthValidationSchema = z.infer<typeof schema>

export default schema
