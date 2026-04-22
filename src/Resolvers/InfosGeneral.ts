
export const InfosGeneral = {
__resolveType(obj) {
                if ("job" in obj || "age" in obj) {
            return "Cv"
        } else if (obj.designation) {
          return "Skill";
        } else {
            return "User"
        }
    }
}