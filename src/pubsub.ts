import { createPubSub } from "graphql-yoga";
import { Cv } from "./generated/prisma/client";

export const pubsub = createPubSub<{
  CV_ADDED:   [payload: Cv];
  CV_UPDATED: [payload: Cv];
  CV_DELETED: [payload: Cv];
}>();