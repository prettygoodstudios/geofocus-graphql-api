import { ApolloError } from "apollo-server-errors";
import User, { UserRepository } from "../models/user";
import { PublicSlugResolver, StandardResolver } from "../types";
import { AuthError } from "./auth";

export const topUsers: StandardResolver<Promise<User[]>> = async (parent, args, {orm})  => {    

    const users: User[] = await orm 
        .manager
        .connection
        .getCustomRepository(UserRepository)
        .topUsers(orm);
    return users;
}

export const user: PublicSlugResolver<Promise<User>> = async (parent, {slug}, {orm}) => {

    const user: User|undefined = await orm
        .manager 
        .connection 
        .getRepository(User)
        .findOne({
            where: {
                slug
            },
            relations: ["photos", "photos.location", "photos.user"]
        });

    return user!;
}

export const me: StandardResolver<Promise<User|null>> = async (parent, args, {orm, req}) => {
    try {
        const user: User|undefined = await orm
            .manager 
            .connection 
            .getRepository(User)
            .findOneOrFail({
                where: {
                    id: req.userId
                },
                relations: ["photos", "photos.location", "photos.user"]
            });
            return user;
    }catch{
        AuthError("You must be authenticated to perform this action.");
    }
    return null;
}