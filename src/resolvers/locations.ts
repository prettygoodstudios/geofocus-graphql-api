import { Connection } from "typeorm";
import Location from "../models/location";

export const locations = async (orm: Connection): Promise<Location[]> => {  
    return await orm
        .manager
        .connection
        .getRepository(Location)
        .find({
            relations: ["photos"]
        });
}