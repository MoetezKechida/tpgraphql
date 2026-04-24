import { GraphQLContext, CvRecord, Skill as SkillType } from "../types";
import { resolveSkillCvs } from "../services/cvService";

export const Skill = {
  cvs: (parent: SkillType, _: unknown, { db }: GraphQLContext): CvRecord[] =>
    resolveSkillCvs(db, parent.id),
};
