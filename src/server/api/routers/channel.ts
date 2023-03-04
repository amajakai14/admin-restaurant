import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as repository from "../repository/channel.repository";
import * as courseRepository from "../repository/course.repository";
import * as deskRepository from "../repository/desk.repository";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const createChannelSchema = z.object({
  table_id: z.number(),
  course_id: z.number(),
});
export type CreateChannelInput = z.TypeOf<typeof createChannelSchema>;

export const channelStatus = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
} as const;

export const updateChannelSchema = z.object({
  channel_id: z.string(),
  status: z.enum([channelStatus.ONLINE, channelStatus.OFFLINE]),
});
export type UpdateChannelInput = z.TypeOf<typeof updateChannelSchema>;

export const getActiveChannelSchema = z.object({
  table_id: z.number(),
});
export type ActiveChannel = z.TypeOf<typeof getActiveChannelSchema>;

export const channelRouter = createTRPCRouter({
  register: protectedProcedure
    .input(createChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const { table_id, course_id } = input;
      const deskPromise = deskRepository.getDesk(ctx.prisma, table_id);
      const channelIdPromise = repository.generateChannelId(ctx.prisma);
      const coursePromise = courseRepository.getCourse(ctx.prisma, course_id);

      const [desk, channelId, course] = await Promise.all([
        deskPromise,
        channelIdPromise,
        coursePromise,
      ]);

      if (!desk || desk.is_occupied) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "unable to create channel for this desk",
        });
      }

      if (!course) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Course not found",
        });
      }
      await repository.createChannel(ctx.prisma, channelId, table_id, course);

      return {
        result: channelId,
      };
    }),

  updateChannel: protectedProcedure
    .input(updateChannelSchema)
    .mutation(async ({ ctx, input }) => {
      const { channel_id, status } = input;
      const result = await ctx.prisma.channel.update({
        where: { id: channel_id },
        data: { id: channel_id, status },
      });

      return {
        result,
      };
    }),

  getChannelsOnCurrentDate: protectedProcedure
    .input(z.object({ table_id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { table_id } = input;
      const channels = await repository.getChannelsOnCurrentDate(
        ctx.prisma,
        table_id
      );

      return {
        result: channels,
      };
    }),

  getChannel: protectedProcedure
    .input(z.object({ channel_id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { channel_id } = input;
      const channel = await repository.getChannel(ctx.prisma, channel_id);

      if (!channel) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Channel not found",
        });
      }

      return {
        result: channel,
      };
    }),
});
