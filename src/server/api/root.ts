import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { channelRouter } from "./routers/channel";
import { courseRouter } from "./routers/course";
import { menuRouter } from "./routers/menu";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  menu: menuRouter,
  course: courseRouter,
  channel: channelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
