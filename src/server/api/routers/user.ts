import z from "zod";
import { generateRandomPassword, hashPassword } from "../../../utils/password";

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
export type UserRole = "ADMIN" | "STAFF";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  corporation: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export const createStaffSchema = z.object({
  email: z.string().email(),
});

export type CreateStaffInput = z.TypeOf<typeof createUserSchema>;

export const userRouter = createTRPCRouter({
  register: publicProcedure
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
      const exist = await ctx.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });
      if (exist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "this email has already registered",
        });
      }
      const hash = await hashPassword(password);
      await ctx.prisma.user.create({
        data: {
          email,
          password: hash,
          name: email.substring(0, email.indexOf("@")),
          role: "ADMIN",
          corporation: { connect: { id: corporation } },
        },
      });
      return {
        status: 201,
        message: "Account created Successfully",
        result: email,
      };
    }),

  getStaff: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    const result = await ctx.prisma.user.findMany({
      select: { id: true, name: true, email: true },
      where: { role: "STAFF", corporation_id },
    });
    if (!result) {
      return {
        status: 404,
        message: "No staff is found",
      };
    }
    return {
      status: 201,
      result,
    };
  }),

  registerStaff: protectedProcedure
    .input(createStaffSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      const { email } = input;
      const exist = await ctx.prisma.user.findFirst({
        where: { email: email.toLowerCase() },
      });
      if (exist) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "this email has already registered",
        });
      }
      const password = generateRandomPassword();
      const hash = await hashPassword("Password123");
      await ctx.prisma.user.create({
        data: {
          email,
          password: hash,
          name: email.substring(0, email.indexOf("@")),
          role: "STAFF",
          corporation: { connect: { id: corporation_id } },
        },
      });
      return {
        status: 201,
        message: "Staff Account created Successfully",
        result: { email, password },
      };
    }),
});
