import { z } from 'zod'

export const schema = z.object({
	id: z.number().nonnegative(),
})

export type UserExternalValidationSchema = z.infer<typeof schema>

export default schema
