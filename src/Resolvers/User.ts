import { GraphQLContext, CvRecord, User as UserType } from "../types";
import { resolveUserCvs } from "../services/cvService";

export const User = {
  cv: (parent: UserType, _: unknown, { db }: GraphQLContext): CvRecord[] =>
    resolveUserCvs(db, parent.cv ?? []),
};
