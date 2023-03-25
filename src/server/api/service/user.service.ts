import { type PrismaClient, type User } from "@prisma/client";
import { z } from "zod";
import { generateRandomPassword, hashPassword } from "../../../utils/password";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  corporation: z.string(),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>;

export async function createUserService(
  prisma: PrismaClient,
  mail_address: string,
  password: string,
  corporation_id: string
): Promise<Omit<User, "password">> {
  const hash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email: mail_address,
      password: hash,
      name: mail_address.substring(0, mail_address.indexOf("@")),
      role: "ADMIN",
      Corporation: { connect: { id: corporation_id } },
    },
  });
  return excludePassword(user);
}

function excludePassword(user: User): Omit<User, "password"> {
  const { password, ...rest } = user;
  return rest;
}

export async function getUserByMailAddressService(
  prisma: PrismaClient,
  mail_address: string
): Promise<User | null> {
  return await prisma.user.findFirst({
    where: { email: mail_address.toLowerCase() },
  });
}

export async function getStaffsService(
  prisma: PrismaClient,
  corporation_id: string
): Promise<Omit<User, "password">[]> {
  const staffs = await prisma.user.findMany({
    where: { role: "STAFF", corporation_id },
  });
  return staffs.map((staff) => excludePassword(staff));
}

export async function createStaffUserService(
  prisma: PrismaClient,
  mail_address: string,
  corporation_id: string
): Promise<User> {
  const password = generateRandomPassword();
  const hash = await hashPassword("Password123");
  await prisma.user.create({
    data: {
      email: mail_address,
      password: hash,
      name: mail_address.substring(0, mail_address.indexOf("@")),
      role: "STAFF",
      Corporation: { connect: { id: corporation_id } },
    },
  });
  const user = await prisma.user.create({
    data: {
      email: mail_address,
      name: mail_address.substring(0, mail_address.indexOf("@")),
      role: "STAFF",
      Corporation: { connect: { id: corporation_id } },
    },
  });
  return excludePassword(user);
}
