import z from "zod";
import * as repository from "../repository/user.repository";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export type UserRole = "ADMIN" | "STAFF";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  corporation: z.string(),
});

export const createStaffSchema = z.object({
  email: z.string().email(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export type CreateStaffInput = z.TypeOf<typeof createUserSchema>;

export const userRouter = createTRPCRouter({
  registerAdmin: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, corporation } = input;
      const corporationExist = await ctx.prisma.corporation.findFirst({
        where: { id: corporation },
      });

      if (!corporationExist) {
        await ctx.prisma.corporation.create({
          data: {
            id: corporation,
            name: corporation + "name",
          },
        });
      }

      const registeredUser = await repository.getUserByMailAddress(
        ctx.prisma,
        email
      );
      if (registeredUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "this email has already registered",
        });
      }

      const user = await repository.createAdminUser(
        ctx.prisma,
        email,
        password,
        corporation
      );
      return {
        result: user,
      };
    }),

  getStaff: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });
    const staffs = await repository.getStaffs(ctx.prisma, corporation_id);
    return {
      result: staffs,
    };
  }),

  registerStaff: protectedProcedure
    .input(createStaffSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      const { email } = input;
      if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });

      const exist = await repository.getUserByMailAddress(ctx.prisma, email);
      if (exist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "this email has already registered",
        });
      }

      const staff = await repository.createStaffUser(
        ctx.prisma,
        email,
        corporation_id
      );
      return {
        status: 201,
        message: "Staff Account created Successfully",
        result: staff,
      };
    }),
});
