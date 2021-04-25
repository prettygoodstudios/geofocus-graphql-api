import { Connection, In } from "typeorm";
import User, { UserRepository } from "../models/user";

export const topUsers = async (orm: Connection): Promise<User[]> => {    

    const users: User[] = await orm 
        .manager
        .connection
        .getCustomRepository(UserRepository)
        .topUsers(orm);
    return users;
}

export const user = async (orm: Connection, slug: string): Promise<User> => {

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