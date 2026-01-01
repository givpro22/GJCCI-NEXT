import { z } from "zod";

export const createPostSchema = z.object({
  session: z.object({
    user: z.object({
      id: z.string(),
      name: z.string().nullish(),
    }),
  }),
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string(),
  anonymous: z.boolean(),
});
