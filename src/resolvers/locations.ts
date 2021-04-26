import { geocoder } from "../config";
import Location from "../models/location";
import { PublicSlugResolver, StandardResolver } from "../types";
import slugify from "slugify";
import { validate } from "class-validator";
import { ApolloError } from "apollo-server-express";
import { humanReadableList } from "../helpers";

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

const LOCATION_VALIDATION = 'LOCATION_VALIDATION';

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
            throw new ApolloError("Could not find location.", LOCATION_VALIDATION);
        }

        const coord = coords[0];

        if(coord!.extra!.confidence! < 7){
            throw new ApolloError("Could not find location.", LOCATION_VALIDATION);
        }

        location.latitude = coord.latitude!.valueOf();
        location.longitude = coord.longitude!.valueOf();
        location.slug = slugify(location.humanReadableAddress(), {
            lower: true
        });

        const errors = await validate(location);
        const errorMessage = `The following inputs failed validation ${humanReadableList(errors.map(e => e.property))}.`;
        console.log(errors);
        if (errors.length > 0){
            throw new ApolloError(errorMessage, LOCATION_VALIDATION);
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