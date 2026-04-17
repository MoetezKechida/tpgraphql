export const DB = {
    skills:[
        {
            id:1,
            designation:"typescript"
        },
        {
            id:2,
            designation:"graphql"
        },
        {
            id:3,
            designation:"nodejs"
        }
    ],
    cvs:[
        {
            id:1,
            name:"John Doe",
            age:30,
            job:"Software Engineer",
            skills: [1, 2],
            user: 1,

        },
        {
            id:3,
            name:"John Doe",
            age:30,
            job:"Software Engineer",
            skills: [1, 3],
            user: 1,

        },
        {
            id:2,
            name:"Jane Smith",
            age:25,
            job:"Product Manager",
            skills: [2, 3],
            user: 2,
        }
    ],
    
    
    users:[
        {
            id:1,
            name:"John Doe",
            email:"john.doe@example.com",
            role: "USER",
            cv: [1, 3],
        },
        {
            id:2,
            name:"Jane Smith",
            email:"jane.smith@example.com",
            role: "ADMIN",
            cv: [2],
        }
    ]
};