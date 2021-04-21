import { Connection } from "typeorm";
import Photo from "../models/photo";

export const photo = async (orm: Connection, slug: string): Promise<Photo|null> => {    
    const photos = await orm
        .manager
        .connection
        .createQueryBuilder()
        .select()
        .from(Photo, "photos")
        .where("slug = :slug", {slug})
        .execute();
    return photos.length > 0 ? photos[0] : null;
}