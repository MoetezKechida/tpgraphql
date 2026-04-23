export const InfosGeneral = {
  __resolveType(obj: any) {
    if ("age" in obj) {
      return "Cv";
    } else if ("designation" in obj) {
      return "Skill";
    } else {
      return "User";
    }
  },
};