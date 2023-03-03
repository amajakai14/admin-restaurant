import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isValidPrice } from "../../../utils/input.validation";
import * as repository from "../repository/course.repository";
import * as menuRepository from "../repository/menu.repository";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { menuType } from "./menu";

export const createCourseSchema = z.object({
  course_name: z.string(),
  course_price: z.number().nonnegative(),
  course_timelimit: z.number().nonnegative(),
});

export const courseOnMenuSchema = z.object({
  menu_id: z.number(),
  course_id: z.number(),
});

export const coursesOnMenusSchema = z.array(courseOnMenuSchema).nullish();

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

  getMenuMapping: protectedProcedure.query(async ({ ctx }) => {
    const { corporation_id } = ctx.session.user;
    if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });
    const coursePromise = repository.getCourses(ctx.prisma, corporation_id);
    const menuPromise = menuRepository.getMenus(ctx.prisma, corporation_id);
    const courseOnMenuPromise = repository.getCourseAndMenuRelations(
      ctx.prisma,
      corporation_id
    );
    const [menus, courses, CoursesOnMenus] = await Promise.all([
      menuPromise,
      coursePromise,
      courseOnMenuPromise,
    ]);
    menus.sort((left, right) => {
      const leftIndex = menuType.findIndex((val) => val === left.menu_type);
      const rightIndex = menuType.findIndex((val) => val === right.menu_type);
      return leftIndex - rightIndex;
    });

    return {
      result: {
        menus,
        courses,
        course_on_menu: CoursesOnMenus,
      },
    };
  }),

  mapMenuToCourse: protectedProcedure
    .input(coursesOnMenusSchema)
    .mutation(async ({ ctx, input }) => {
      const corporation_id = ctx.session.user.corporation_id;
      if (!corporation_id) throw new TRPCError({ code: "UNAUTHORIZED" });
      await repository.updateAllCourseAndMenuRelations(
        ctx.prisma,
        input,
        corporation_id
      );
    }),
});
