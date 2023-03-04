import { CourseOnMenu, type Course, type PrismaClient } from "@prisma/client";
import { type z } from "zod";
import {
  coursesOnMenusSchema,
  type createCourseSchema,
} from "../routers/course";
import {
  createCourseService,
  getCourseAndMenuRelationsService,
  getCourseService,
  getCoursesService,
  updateAllCourseAndMenuRelationsService,
} from "../service/course.service";

export const getCourse: GetCourse = getCourseService;

export const getCourses: GetCourses = getCoursesService;

export const createCourse: CreateCourse = createCourseService;

export const getCourseAndMenuRelations: GetCourseAndMenuRelations =
  getCourseAndMenuRelationsService;

export const updateAllCourseAndMenuRelations: UpdateAllCourseAndMenuRelations =
  updateAllCourseAndMenuRelationsService;

interface GetCourse {
  (prisma: PrismaClient, course_id: number): Promise<Course | null>;
}

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

interface GetCourseAndMenuRelations {
  (prisma: PrismaClient, corporation_id: string): Promise<CourseOnMenu[]>;
}

interface UpdateAllCourseAndMenuRelations {
  (
    prisma: PrismaClient,
    input: CoursesOnMenus,
    corporation_id: string
  ): Promise<void>;
}

export type CreateCourseInput = z.TypeOf<typeof createCourseSchema>;

export type CoursesOnMenus = z.TypeOf<typeof coursesOnMenusSchema>;
