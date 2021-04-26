import { Connection } from "typeorm";
import User from "./models/user";

export type StandardResolver<Type> = (parent: any, args: any, context: ApolloContext, info: any) => Type;
export type PublicSlugResolver<Type> = (parent: any, {slug} : {slug: string}, context: ApolloContext, info: any) => Type;
export type LoginResolver = (parent: any, {email, password} : {email: string, password: string}, context: ApolloContext, info: any) => Promise<User|null>;

export type ApolloContext = {
    orm: Connection,
    req: any,
    res: any
}