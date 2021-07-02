import { geocoder } from "../config";
import Location from "../models/location";
import { LocationResolver, PublicSlugResolver, StandardResolver } from "../types";
import slugify from "slugify";
import { validate } from "class-validator";
import { ApolloError } from "apollo-server";
import { humanReadableList } from "../helpers";
import { AuthError } from "./auth";
import { Connection } from "typeorm";

export const locations: StandardResolver<Promise<Location[]>> = async (parent, args, {orm}) => {  
    return await orm
        .manager
        .connection
        .getRepository(Location)
        .find({
            relations: ["photos", "photos.user", "photos.location", "user"]
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
            relations: ["photos", "photos.user", "photos.location", "user", "reviews", "reviews.user"]
        });
    return locations.length > 0 ? locations[0] : null;
}

const LOCATION_VALIDATION = 'LOCATION_VALIDATION';

const saveLocation = async (location: Location, orm: Connection, update: boolean, {title, address, city, state, country, userId} : {title: string, address: string, city: string, state: string, country: string, userId: number}) => {
    location.address = address;
    location.city = city;
    location.state = state;
    location.country = country;
    location.title = title;
    location.user_id = userId;
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
    if(!update){
        location.slug = slugify(location.humanReadableAddress(), {
            lower: true
        });
    }

    const errors = await validate(location);
    const errorMessage = `The following inputs failed validation ${humanReadableList(errors.map(e => e.property))}.`;
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

export const createLocation: LocationResolver = async (parent, {title, address, city, state, country}, {orm, req}) => {
    if(req.userId){
        const location = new Location();
        return saveLocation(location, orm, false, {title, address, city, state, country, userId: req.userId});
    }

    throw AuthError("You must be authenticated to perform this action.");
}

export const updateLocation: LocationResolver = async (parent, {title, address, city, state, country, slug}, {orm, req}) => {
    if (req.userId) {
        const location = await orm 
            .manager 
            .connection 
            .getRepository(Location)
            .findOneOrFail({
                where: {
                    slug
                },
                relations: ["user"]
            });
        if(location.user.id !== req.userId){
            AuthError("You don't have access to this location.");
            return null;
        }
        return saveLocation(location, orm, true, {title, address, city, state, country, userId: location.user_id});
    }
    throw AuthError("You must be authenticated to perform this action.");
}

export const deleteLocation: PublicSlugResolver<Promise<number|null|undefined>> = async (parent, {slug}, {orm, req}) => {
    if (req.userId) {
        const result = await orm
            .manager 
            .connection
            .getRepository(Location)
            .delete({
                user: {
                    id: req.userId
                },
                slug
            });
        return result.affected;
    }
    throw AuthError("You must be authenticated to perform this action.");
}