import type { Channel, Course, PrismaClient } from "@prisma/client";
import { channelStatus } from "../routers/channel";

export async function generateChannelIdService(
  prisma: PrismaClient
): Promise<string> {
  let id = crypto.randomUUID();
  while (true) {
    const channel = await getChannelService(prisma, id);
    if (!channel) break;
    id = crypto.randomUUID();
  }
  return id;
}

export async function getChannelService(
  prisma: PrismaClient,
  channel_id: string
): Promise<Channel | null> {
  return await prisma.channel.findUnique({ where: { id: channel_id } });
}

export async function getChannelsOnCurrentDateService(
  prisma: PrismaClient,
  table_id: number
): Promise<Channel[]> {
  return await prisma.channel.findMany({
    where: { table_id, time_start: { gte: midnightOfCurrentDate() } },
  });
}

export async function createChannelService(
  prisma: PrismaClient,
  id: string,
  table_id: number,
  course: Course
) {
  const time_start = new Date();
  const time_end = calculateTimeLimit(time_start, course.course_timelimit);
  await prisma.$transaction([
    prisma.channel.create({
      data: {
        id,
        Desk: { connect: { id: table_id } },
        Course: { connect: { id: course.id } },
        status: channelStatus.ONLINE,
        time_start,
        time_end,
      },
    }),
    prisma.desk.update({
      where: { id: table_id },
      data: { is_occupied: true },
    }),
  ]);
}

function calculateTimeLimit(time_start: Date, timelimit: number | null) {
  const defaultTime = 90;
  return timelimit == null
    ? addMinutes(time_start, defaultTime)
    : addMinutes(time_start, timelimit);
}

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

function midnightOfCurrentDate() {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0
  );
}
