import { geocoder } from "../config";
import Location from "../models/location";
import { PublicSlugResolver, StandardResolver } from "../types";
import slugify from "slugify";
import { validate } from "class-validator";

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

export const createLocation: StandardResolver<Promise<Location|null>> = async (parent, {title, address, city, state, country}: {title: string, address: string, city: string, state: string, country: string}, {orm, req}) => {
    if(req.userId){
        const location = new Location();
        location.address = address;
        location.city = city;
        location.state = state;
        location.country = country;
        location.title = title;
        location.user_id = req.userId;
        location.created_at = new Date();
        location.updated_at = new Date();

        const coords = await geocoder.geocode(location.humanReadableAddress());

        coords.sort((a, b) => {
            const confidence1: number = a!.extra!.confidence!;
            const confidence2: number = b!.extra!.confidence!;
            return confidence2 - confidence1;
        });

        if (coords.length == 0){
            return null;
        }

        const coord = coords[0];

        if(coord!.extra!.confidence! < 7){
            return null;
        }

        location.latitude = coord.latitude!.valueOf();
        location.longitude = coord.longitude!.valueOf();
        location.slug = slugify(location.humanReadableAddress(), {
            lower: true
        });

        const errors = await validate(location);

        if (errors.length > 0){
            return null;
        }

        await orm 
            .manager 
            .connection 
            .getRepository(Location)
            .save(location);

        return location;
    }
    return null;
}