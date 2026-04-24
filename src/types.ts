export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Skill {
  id: number;
  designation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  cv: number[];
}

export interface CvRecord {
  id: number;
  name: string;
  age: number | null;
  job: string | null;
  skills: number[];
  user: number;
  deletedAt: string | null;
}

export interface Database {
  skills: Skill[];
  users: User[];
  cvs: CvRecord[];
}

import { PubSub } from "graphql-yoga";

export enum MutationType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

export interface SubscriptionPayload {
  mutation: MutationType;
  cv: CvRecord;
}

export type PubSubEvents = {
  cv: [SubscriptionPayload];
};

export interface GraphQLContext {
  db: Database;
  pubSub: PubSub<PubSubEvents>;
}

export interface CreateCvInput {
  name: string;
  age?: number;
  job?: string;
  userId: number;
  skillIds: number[];
}

export interface UpdateCvInput {
  name?: string;
  age?: number;
  job?: string;
  userId?: number;
  skillIds?: number[];
}
