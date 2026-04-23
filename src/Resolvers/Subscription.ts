import { pubSub } from "../schema";


export const Subscription: any = {
    cv: {
        subscribe: () => {
            return pubSub.subscribe("cv");
        },
        resolve: (payload: any) => {
            return payload.cv;
        },
        
    },
};