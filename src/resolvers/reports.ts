import { ApolloError } from "apollo-server";
import { Connection } from "typeorm";
import Photo from "../models/photo";
import Report from "../models/report";
import Review from "../models/review";
import User from "../models/user";
import Location from "../models/location";
import { ReportResolver, StandardResolver } from "../types";
import { validateFields } from "../helpers";

const REPORT_ERROR = 'REPORT_ERROR';

const checkAdmin = async (userId: number, orm: Connection) => {
    return userId && (await orm.manager.getRepository(User).findOneOrFail({id: userId})).role === 'admin';
}

export const reports: StandardResolver<Promise<Report[]>> = async (parent, args, {orm, req}, info) => {
    if (await checkAdmin(req.userId, orm)) {
        return await orm
            .manager
            .getRepository(Report)
            .find({
                relations: ["location", "location.user", "review", "review.user", "photo", "photo.user", "review.location"]
            }); 
    }
    throw new ApolloError("You are not authorized to access this data", REPORT_ERROR);
}


export const report: ReportResolver = async (parent, {message, location, photo, review}, {orm, req}, info) => {
    if (req.userId) {
        const report = new Report();
        report.created_at = new Date();
        report.updated_at = new Date();
        report.message = message;
        report.location = (await orm
            .manager
            .getRepository(Location)
            .findOne({
                slug: location
            }))!;
        report.photo = (await orm
            .manager 
            .getRepository(Photo)
            .findOne({
                slug: photo
            }))!;
        report.review = (await orm
            .manager
            .getRepository(Review)
            .findOne({
                slug: review
            }))!;
        
        validateFields(report);

        if (report.review || report.photo || report.location) {
            return await orm
                .manager 
                .getRepository(Report)
                .save(report);
        }
        throw new ApolloError("There is no selected entity for this report.", REPORT_ERROR);
    }
    throw new ApolloError("You are not authorized to perform this action.", REPORT_ERROR);
}

export const deleteReport: StandardResolver<Promise<number|null|undefined>> = async (parent, {id}, {orm, req}, info) => {
    if (checkAdmin(req.userId, orm)) {
        return (await
            orm
            .manager
            .getRepository(Report)
            .delete({
                id
            }))
            .affected;
    }
    throw new ApolloError("You are not authorized to perform this action.", REPORT_ERROR);
}
