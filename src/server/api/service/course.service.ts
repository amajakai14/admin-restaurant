import { Course, PrismaClient } from "@prisma/client";
import { CreateCourseInput } from "../repository/course.repository";

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
