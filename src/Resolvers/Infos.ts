export const Infos = {
  __resolveType(obj: any) {
    if ("age" in obj) {
      return "Cv";
    } else {
      return "User";
    }
  },
};