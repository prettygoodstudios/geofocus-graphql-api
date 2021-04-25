import { Connection } from "typeorm";
import Location from "../models/location";
import { PublicSlugResolver, StandardResolver } from "../types";

export const locations: StandardResolver<Promise<Location[]>> = async (parent, args, {orm}) => {  
    return await orm
        .manager
        .connection
        .getRepository(Location)
        .find({
            relations: ["photos", "photos.user", "photos.location"]
        });
}

export const location: PublicSlugResolver<Promise<Location|null>> = async (parent, {slug}, {orm}) => {
    const locations = await orm    
        .manager
        .connection
        .getRepository(Location)
        .find({
            where: {
                slug
            },
            relations: ["photos", "photos.user", "photos.location"]
        });
    return locations.length > 0 ? locations[0] : null;
}