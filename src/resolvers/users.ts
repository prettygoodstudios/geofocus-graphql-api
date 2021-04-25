import { Connection, In } from "typeorm";
import User, { UserRepository } from "../models/user";
import { PublicSlugResolver, StandardResolver } from "../types";

export const topUsers: StandardResolver<Promise<User[]>> = async (parent, {slug}, {orm})  => {    

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