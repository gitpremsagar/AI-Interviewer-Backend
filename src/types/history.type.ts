import { z } from 'zod';

const partSchema = z.object({
  text: z.string(),
});

const historySchema = z.array(
  z.object({
    role: z.enum(["user", "model"]),
    parts: z.array(partSchema),
  })
);

type Part = z.infer<typeof partSchema>;
type History = z.infer<typeof historySchema>;

export { historySchema };

export type { Part, History };