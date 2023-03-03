import { type PrismaClient, type User } from "@prisma/client";
import {
  createStaffUserService,
  createUserService as createAdminUserService,
  getStaffsService,
  getUserByMailAddressService,
} from "../service/user.service";

export const createAdminUser: CreateAdminUser = createAdminUserService;

export const getUserByMailAddress: GetUserByMailAddress =
  getUserByMailAddressService;

export const getStaffs: GetStaffs = getStaffsService;

export const createStaffUser: CreateStaffUser = createStaffUserService;

export interface CreateAdminUser {
  (
    prisma: PrismaClient,
    mail_address: string,
    password: string,
    corporation_id: string
  ): Promise<Omit<User, "password">>;
}

interface GetUserByMailAddress {
  (prisma: PrismaClient, mail_address: string): Promise<User | null>;
}

interface GetStaffs {
  (prisma: PrismaClient, corporation_id: string): Promise<
    Omit<User, "password">[]
  >;
}

interface CreateStaffUser {
  (prisma: PrismaClient, mail_address: string, corporation_id: string): Promise<
    Omit<User, "password">
  >;
}
