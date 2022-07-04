import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import { prisma } from "../../../prisma";

export const appRouter = trpc
  .router<Context>()
  .query("users", {
    async resolve({ ctx: { prisma } }) {
      return prisma.user.findMany({
        select: {
          name: true,
          memberSince: true,
        },
      });
    },
  })
  .mutation("create_account", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ input: { name } }) {
      const newDate = await prisma.user.create({
        data: {
          name,
        },
        select: {
          memberSince: true,
        },
      });
      return { memberSince: newDate, name };
    },
  });

export type AppRouter = typeof appRouter;

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});

export async function createContext() {
  return {
    prisma,
  };
}
type Context = trpc.inferAsyncReturnType<typeof createContext>;
