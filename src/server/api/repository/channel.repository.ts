import { Channel, Course, PrismaClient } from "@prisma/client";
import {
  createChannelService,
  generateChannelIdService,
  getChannelService,
  getChannelsOnCurrentDateService,
} from "../service/channel.service";

export const generateChannelId: GenerateChannelId = generateChannelIdService;

export const getChannel: GetChannel = getChannelService;

export const getChannelsOnCurrentDate: GetChannelsOnCurrentDate =
  getChannelsOnCurrentDateService;

export const createChannel: CreateChannel = createChannelService;

interface GenerateChannelId {
  (prisma: PrismaClient): Promise<string>;
}

interface GetChannel {
  (prisma: PrismaClient, channel_id: string): Promise<Channel | null>;
}

interface GetChannelsOnCurrentDate {
  (prisma: PrismaClient, table_id: number): Promise<Channel[]>;
}

interface CreateChannel {
  (
    prisma: PrismaClient,
    id: string,
    table_id: number,
    course: Course
  ): Promise<void>;
}
