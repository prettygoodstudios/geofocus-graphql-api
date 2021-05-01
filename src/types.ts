import { Connection } from "typeorm";
import Location from "./models/location";
import User from "./models/user";

export type StandardResolver<Type> = (parent: any, args: any, context: ApolloContext, info: any) => Type;
export type PublicSlugResolver<Type> = (parent: any, {slug} : {slug: string}, context: ApolloContext, info: any) => Type;
export type LoginResolver = (parent: any, {email, password} : {email: string, password: string}, context: ApolloContext, info: any) => Promise<User|null>;
export type LocationResolver = (parent: any, {title, address, city, state, country, slug}: {title: string, address: string, city: string, state: string, country: string, slug?: string}, context: ApolloContext, info: any) => Promise<Location|null>;
export type RegisterResolver = (parent: any, {email, password} : {email: string, password: string, display: string, bio: string, file: any, zoom: number, offsetX: number, offsetY: number, width: number, height: number}, context: ApolloContext, info: any) => Promise<User|null>;
export type ApolloContext = {
    orm: Connection,
    req: any,
    res: any
}