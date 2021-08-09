import { Connection } from "typeorm";
import Location from "./models/location";
import Review from "./models/review";
import User from "./models/user";
import Report from "./models/report";
import Photo from "./models/photo";

export type StandardResolver<Type> = (parent: any, args: any, context: ApolloContext, info: any) => Type;
export type PublicSlugResolver<Type> = (parent: any, {slug} : {slug: string}, context: ApolloContext, info: any) => Type;
export type ReviewResolver = (parent: any, {location, message, score, user} : {location: string, message: string, score: number, user?: string}, context: ApolloContext, info: any) => Promise<Review>;
export type ReportResolver = (parent: any, {location, message, photo, review} : {message: string, location: string, review: string, photo: string}, context: ApolloContext, info: any) => Promise<Report>;
export type LoginResolver = (parent: any, {email, password} : {email: string, password: string}, context: ApolloContext, info: any) => Promise<User|null>;
export type LocationResolver = (parent: any, {title, address, city, state, country, slug}: {title: string, address: string, city: string, state: string, country: string, slug?: string}, context: ApolloContext, info: any) => Promise<Location|null>;
export type RegisterResolver = (parent: any, {email, password} : ProfileInfo, context: ApolloContext, info: any) => Promise<User|null>;
export type UpdateProfileResolver = (parent: any, {email, password} : ProfileInfo, context: ApolloContext, info: any) => Promise<User|null>;
export type ApolloContext = {
    orm: Connection,
    req: any,
    res: any
}
export type ProfileInfo = {
    email: string, 
    password: string, 
    display: string, 
    bio: string,
    file: any,
    zoom: number,
    offsetX: number, 
    offsetY: number, 
    width: number, 
    height: number
}