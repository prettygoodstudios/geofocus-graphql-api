import { Connection } from "typeorm";

export type StandardResolver<Type> = (parent: any, args: any, context: ApolloContext, info: any) => Type;
export type PublicSlugResolver<Type> = (parent: any, {slug} : {slug: string}, context: ApolloContext, info: any) => Type;

export type ApolloContext = {
    orm: Connection
}