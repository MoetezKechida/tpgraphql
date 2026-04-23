import { GraphQLContext, CvRecord } from "../types";

export const Query = {
  cv: (_: unknown, { id }: { id: number }, { db }: GraphQLContext): CvRecord | null => {
    const cv = db.cvs.find((c) => c.id === id);
    if (!cv || cv.deletedAt) return null;
    return cv;
  },
  cvs: (_: unknown, __: unknown, { db }: GraphQLContext): CvRecord[] =>
    db.cvs.filter((c) => !c.deletedAt),
};
