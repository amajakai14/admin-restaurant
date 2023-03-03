import { Course, CourseOnMenu, PrismaClient } from "@prisma/client";
import {
  CoursesOnMenus,
  CreateCourseInput,
} from "../repository/course.repository";

export function todoCourse() {
  return;
}

export async function getCoursesService(
  prisma: PrismaClient,
  corporation_id: string
): Promise<Course[]> {
  return await prisma.course.findMany({
    where: {
      corporation_id,
    },
  });
}

export async function createCourseService(
  prisma: PrismaClient,
  input: CreateCourseInput,
  corporation_id: string
): Promise<Course> {
  const { course_name, course_price, course_timelimit } = input;

  return await prisma.course.create({
    data: {
      course_name,
      course_price,
      course_timelimit,
      Corporation: { connect: { id: corporation_id } },
    },
  });
}

export async function getCourseAndMenuRelationsService(
  prisma: PrismaClient,
  corporation_id: string
): Promise<CourseOnMenu[]> {
  return await prisma.courseOnMenu.findMany({
    where: {
      corporation_id,
    },
  });
}

type CourseOnMenuInput = {
  course_id: number;
  menu_id: number;
  corporation_id: string;
};

export async function updateAllCourseAndMenuRelationsService(
  prisma: PrismaClient,
  input: CoursesOnMenus,
  corporation_id: string
): Promise<void> {
  let courseAndMenuRelations: CourseOnMenuInput[] | undefined = undefined;
  if (input) {
    courseAndMenuRelations = input.map((props) => ({
      ...props,
      corporation_id,
    }));
  }

  await prisma.$transaction(async (tx) => {
    await tx.courseOnMenu.deleteMany({
      where: {
        corporation_id,
      },
    });
    if (courseAndMenuRelations) {
      await tx.courseOnMenu.createMany({
        data: courseAndMenuRelations,
      });
    }
  });
}
