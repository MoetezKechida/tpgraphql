export const Infos={
__resolveType(obj) {
        if ("job" in obj || "age" in obj) {
            return "Cv"
        } else {
          return "User"
        } 
    }
}