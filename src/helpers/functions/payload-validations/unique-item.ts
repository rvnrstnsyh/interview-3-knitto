import { z } from 'zod'

export const schema = z.object({
	unique_code: z.string(),
})

export type UniqueItemValidationSchema = z.infer<typeof schema>

export default schema
