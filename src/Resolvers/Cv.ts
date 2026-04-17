export const Cv ={
    skills: (parent, _, { db }) => {
        return parent.skills.map((skillId) => db.skills.find((s) => s.id === skillId));
    },
    user: (parent, _, { db }) => {
        return db.users.find((u) => u.id === parent.user);
    }
}