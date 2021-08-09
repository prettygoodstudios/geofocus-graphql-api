import { Connection, createConnection } from "typeorm";
import { config } from "dotenv";
import Location from "./models/location";
import Photo from "./models/photo";
import Report from "./models/report";
import Review from "./models/review";
import User from "./models/user";

config();

export const connection = async (): Promise<Connection> => {
    return await createConnection({
        type: process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite'  | 'mariadb', 
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string),
        username: process.env.DB_USER as string,
        database: process.env.DB_NAME as string,
        entities: [Location, Photo, User, Review, Report]
    });
}