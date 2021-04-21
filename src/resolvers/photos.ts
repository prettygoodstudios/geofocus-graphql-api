import { Connection } from "typeorm";
import Photo from "../models/photo";

export const photo = async (orm: Connection, slug: string): Promise<Photo|null> => {    
    const photos = await orm
        .manager
        .connection
        .manager
        .getRepository(Photo)
        .find({
            where: {
                slug
            },
            relations: ["user"]
        });
        
    return photos.length > 0 ? photos[0] : null;
}