
export const InfosGeneral = {
__resolveType(obj) {
        if(obj.age) {
            return "Cv"
        } else if (obj.designation) {
          return "Skill";
        } else {
            return "User"
        }
    }
}