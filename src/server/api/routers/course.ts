import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isValidPrice } from "../../../utils/input.validation";
import * as repository from "../repository/course.repository";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const createCourseSchema = z.object({
  course_name: z.string(),
  course_price: z.number().nonnegative(),
  course_timelimit: z.number().nonnegative(),
});

export const courseRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });

    const courses = await repository.getCourses(ctx.prisma, corporation_id);
    return {
      result: courses,
    };
  }),

  register: protectedProcedure
    .input(createCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { corporation_id } = ctx.session.user;
      if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (!isValidPrice(input.course_timelimit)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "timelimit should be a number",
        });
      }

      const course = await repository.createCourse(
        ctx.prisma,
        input,
        corporation_id
      );

      return {
        result: course,
      };
    }),
});
