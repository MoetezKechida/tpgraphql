import { GraphQLContext, CvRecord, Skill, User } from "../types";
import { resolveCvSkills, resolveCvUser } from "../services/cvService";

export const Cv = {
  skills: (parent: CvRecord, _: unknown, { db }: GraphQLContext): Skill[] =>
    resolveCvSkills(db, parent.skills),
  user: (parent: CvRecord, _: unknown, { db }: GraphQLContext): User | undefined =>
    resolveCvUser(db, parent.user),
};
