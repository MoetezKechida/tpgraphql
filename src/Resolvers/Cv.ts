import { GraphQLContext, CvRecord, Skill, User } from "../types";

export const Cv = {
  skills: (parent: CvRecord, _: unknown, { db }: GraphQLContext): Skill[] => {
    return parent.skills
      .map((skillId) => db.skills.find((s) => s.id === skillId))
      .filter((s): s is Skill => s !== undefined);
  },
  user: (parent: CvRecord, _: unknown, { db }: GraphQLContext): User | undefined => {
    return db.users.find((u) => u.id === parent.user);
  },
};