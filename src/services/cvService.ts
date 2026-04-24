import { PubSub } from "graphql-yoga";
import {
  CvRecord,
  Database,
  MutationType,
  PubSubEvents,
  Skill,
  User,
} from "../types";

export function getNextCvId(db: Database): number {
  return db.cvs.length > 0 ? Math.max(...db.cvs.map((cv) => cv.id)) + 1 : 1;
}

export function getActiveCvs(db: Database): CvRecord[] {
  return db.cvs.filter((cv) => !cv.deletedAt);
}

export function getCvById(db: Database, id: number): CvRecord | null {
  const cv = db.cvs.find((entry) => entry.id === id);
  if (!cv || cv.deletedAt) {
    return null;
  }
  return cv;
}

export function requireUser(db: Database, userId: number): User {
  const user = db.users.find((entry) => entry.id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export function requireSkills(db: Database, skillIds: number[]): void {
  for (const skillId of skillIds) {
    const skill = db.skills.find((entry) => entry.id === skillId);
    if (!skill) {
      throw new Error("One or more skills not found");
    }
  }
}

export function requireActiveCv(
  db: Database,
  cvId: number,
  deletedMessage: string
): { cv: CvRecord; cvIndex: number } {
  const cvIndex = db.cvs.findIndex((entry) => entry.id === cvId);
  if (cvIndex === -1) {
    throw new Error("CV not found");
  }

  const cv = db.cvs[cvIndex];
  if (cv.deletedAt !== null) {
    throw new Error(deletedMessage);
  }

  return { cv, cvIndex };
}

export function linkCvToUser(user: User, cvId: number): void {
  user.cv = [...(user.cv ?? []), cvId];
}

export function unlinkCvFromUser(user: User | undefined, cvId: number): void {
  if (!user) {
    return;
  }
  user.cv = (user.cv ?? []).filter((entry) => entry !== cvId);
}

export function moveCvToUser(
  db: Database,
  cvId: number,
  fromUserId: number,
  toUserId: number
): void {
  const oldUser = db.users.find((entry) => entry.id === fromUserId);
  const newUser = requireUser(db, toUserId);
  unlinkCvFromUser(oldUser, cvId);
  linkCvToUser(newUser, cvId);
}

export function publishCvEvent(
  pubSub: PubSub<PubSubEvents>,
  mutation: MutationType,
  cv: CvRecord
): void {
  pubSub.publish("cv", { mutation, cv });
}

export function resolveCvSkills(db: Database, skillIds: number[]): Skill[] {
  return skillIds
    .map((skillId) => db.skills.find((entry) => entry.id === skillId))
    .filter((skill): skill is Skill => skill !== undefined);
}

export function resolveCvUser(db: Database, userId: number): User | undefined {
  return db.users.find((entry) => entry.id === userId);
}
