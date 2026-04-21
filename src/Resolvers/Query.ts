export const Query = {
    cv: (_: any, { id }: { id: number }, { db }: { db: any }) => {
        const cv = db.cvs.find((c: any) => c.id === id);
        if (!cv || cv.deletedAt) return null;
        return cv;
    },
    cvs: (_: any, __: any, { db }: { db: any }) =>
        db.cvs.filter((c: any) => !c.deletedAt),
}
