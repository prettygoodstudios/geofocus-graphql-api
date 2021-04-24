import { Connection, In } from "typeorm";
import Photo from "../models/photo";
import User, { UserRepository } from "../models/user";
import { photo } from "./photos";

export const users = async (orm: Connection): Promise<User[]> => {    

    const users: User[] = await orm 
        .manager
        .connection
        .getCustomRepository(UserRepository)
        .topUsers(orm);
    return users;
}