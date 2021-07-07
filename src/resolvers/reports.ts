import { ApolloError } from "apollo-server";
import Report from "../models/report";
import User from "../models/user";
import { StandardResolver } from "../types";

const REPORT_ERROR = 'REPORT_ERROR';
export const reports: StandardResolver<Promise<Report[]>> = async (parent, args, {orm, req}, info) => {
    if (req.userId) {
        if ((await orm.manager.getRepository(User).findOneOrFail({id: req.userId})).role === 'admin' ) {
            return await orm
            .manager
            .getRepository(Report)
            .find({
                relations: ["location", "location.user", "review", "review.user", "photo", "photo.user"]
            }); 
        }
    }
    throw new ApolloError("You are not authorized to access this data", REPORT_ERROR);
}


