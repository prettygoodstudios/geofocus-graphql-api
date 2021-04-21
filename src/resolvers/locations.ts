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

export const location = async (orm: Connection, slug: string): Promise<Location|null> => {
    const locations = await orm    
        .manager
        .connection
        .getRepository(Location)
        .find({
            where: {
                slug
            },
            relations: ["photos"]
        });
    return locations.length > 0 ? locations[0] : null;
}