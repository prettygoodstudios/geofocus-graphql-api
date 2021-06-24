import Review from "../models/review";
import Location from "../models/location"
import { PublicSlugResolver } from "../types";



export const reviews: PublicSlugResolver<Promise<Review[]>> = async (parent, {slug}, {orm, req}) => {
    const location = await orm
        .manager 
        .connection 
        .getRepository(Location)
        .findOneOrFail({
            relations: ["reviews", "reviews.location", "reviews.user"],
            where: {
                slug
            }
        });
    
    return location.reviews;
}