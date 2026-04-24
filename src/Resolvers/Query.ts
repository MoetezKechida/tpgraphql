import { GraphQLContext, CvRecord } from "../types";
import { getActiveCvs, getCvById } from "../services/cvService";

export const Query = {
  cv: (_: unknown, { id }: { id: number }, { db }: GraphQLContext): CvRecord | null =>
    getCvById(db, id),
  cvs: (_: unknown, __: unknown, { db }: GraphQLContext): CvRecord[] => getActiveCvs(db),
};
