import { Connection, In } from "typeorm";
import User, { UserRepository } from "../models/user";

export const users = async (orm: Connection): Promise<User[]> => {    

    const users: User[] = await orm 
        .manager
        .connection
        .getCustomRepository(UserRepository)
        .topUsers(orm);
    return users;
}