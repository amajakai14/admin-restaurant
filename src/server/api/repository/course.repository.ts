import { type Course, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import { type createCourseSchema } from "../routers/course";
import {
  createCourseService,
  getCoursesService,
} from "../service/course.service";

export const getCourses: GetCourses = getCoursesService;

export const createCourse: CreateCourse = createCourseService;

interface GetCourses {
  (prisma: PrismaClient, corporation_id: string): Promise<Course[]>;
}

interface CreateCourse {
  (
    prisma: PrismaClient,
    input: CreateCourseInput,
    corporation_id: string
  ): Promise<Course>;
}

export type CreateCourseInput = z.TypeOf<typeof createCourseSchema>;
