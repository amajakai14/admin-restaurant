import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isValidTableName } from "../../../utils/input.validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import * as repository from "../repository/desk.repository"

export const getTableSchema = z.object({
  table_id: z.number(),
});
export type getTableInput = z.TypeOf<typeof getTableSchema>;

export const createTableSchema = z.object({
  table_name: z.string(),
});
export type CreateTableInput = z.TypeOf<typeof createTableSchema>;

export const tableListSchema = z.object({
  id: z.number(),
  table_name: z.string(),
  available: z.boolean(),
});
export type MenuList = z.TypeOf<typeof tableListSchema>;

export const deskRouter = createTRPCRouter({
  register: protectedProcedure
    .input(createTableSchema)
    .mutation(async ({ ctx, input }) => {
      const { table_name } = input;
      const { corporation_id } = ctx.session.user;
      if (!isValidTableName(table_name)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "table name only contain alphabet, number, -, or _",
        });
      }
      await ctx.prisma.desk.create({
        data: {
          table_name,
          is_occupied: false,
          Corporation: { connect: { id: corporation_id } },
        },
      });
    }),

  getTables: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
	if (!corporation_id) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
		});
	}
	const desks = await repository.getDesks(ctx.prisma, corporation_id);
    return {
      result: desks,
    };
  }),

  getTable: protectedProcedure
    .input(getTableSchema)
    .query(async ({ ctx, input }) => {
      const { table_id } = input;
      const { corporation_id } = ctx.session.user;
      const today = new Date();
      const todayAtMidNight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const result = await ctx.prisma.channel.findMany({
        select: {
          id: true,
          status: true,
          time_start: true,
          time_end: true,
        },
        where: { table_id, time_start: { gte: todayAtMidNight } },
      });
      return {
        status: 201,
        result,
      };
    }),
});
