import { pubsub } from "../pubsub";

export const Subscription : any = {
  cvAdded: {
    subscribe: () => pubsub.subscribe("CV_ADDED"),
    resolve:   (payload: any) => payload,
  },
  cvUpdated: {
    subscribe: () => pubsub.subscribe("CV_UPDATED"),
    resolve:   (payload: any) => payload,
  },
  cvDeleted: {
    subscribe: () => pubsub.subscribe("CV_DELETED"),
    resolve:   (payload: any) => payload,
  },
};