import { Connection } from "typeorm";
import Photo from "../models/photo";
import { PublicSlugResolver } from "../types";

export const photo: PublicSlugResolver<Promise<Photo|null>> = async (parent, {slug}, {orm})  => {    
    const photos = await orm
        .manager
        .connection
        .manager
        .getRepository(Photo)
        .find({
            where: {
                slug
            },
            relations: ["user", "location"]
        });
        
    return photos.length > 0 ? photos[0] : null;
}