import Review from "../models/review";
import Location from "../models/location"
import { PublicSlugResolver, ReviewResolver, StandardResolver } from "../types";
import User from "../models/user";
import { ApolloError } from "apollo-server-express";
import { AuthError } from "./auth";
import { validate } from "class-validator";
import { humanReadableList } from "../helpers";



export const reviews: PublicSlugResolver<Promise<Review[]>> = async (parent, {slug}, {orm, req}) => {
    try {
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
    } catch {
        return [];
    }
}

const REVIEW_ERROR = "REVIEW_ERROR";

export const review: ReviewResolver = async (parent, {location, message, score, user}, {orm, req}) => {
    if (req.userId) {
        const review = new Review();
        review.user = await orm
            .manager
            .getRepository(User)
            .findOneOrFail({
                id: req.userId
            })
            .catch(() => {
                throw new ApolloError("Invalid user.", REVIEW_ERROR)
            });
        if (review.user.role === 'admin' && user) {
            review.user = await orm
                .manager
                .getRepository(User)
                .findOneOrFail({
                    slug: user
                })
                .catch(() => {
                    throw new ApolloError("Invalid user.", REVIEW_ERROR)
                });
        }
        review.location = await orm 
            .manager 
            .getRepository(Location)
            .findOneOrFail({
                slug: location
            })
            .catch(() => {
                throw new ApolloError("Invalid location.", REVIEW_ERROR);
            });
        review.message = message;
        review.score = score;
        review.created_at = new Date();
        review.updated_at = new Date();

        const errors = await validate(review);

        if (errors.length > 0) {
            throw new ApolloError(`The following fields failed validation ${humanReadableList(errors.map(e => e.property))}.`);
        }

        await orm
            .manager 
            .getRepository(Review)
            .delete({
                location: review.location,
                user: review.user
            });
        
        return await orm
            .manager 
            .getRepository(Review)
            .save(review);
    }
    throw AuthError("You must be authenticated to perform this action.");
}

export const deleteReview: StandardResolver<Promise<any>> = async (parent, {location, user: slug}, {orm, req}) => {
    if (req.userId) {
        const reviewLocation = await orm 
            .manager 
            .getRepository(Location)
            .findOneOrFail({
                slug: location
            })
            .catch(() => {
                throw new ApolloError("Invalid location.", REVIEW_ERROR);
            });
        const getUser = async (props: any) => await orm
            .manager
            .getRepository(User)
            .findOneOrFail({
                ...props
            })
            .catch(() => {
                throw new ApolloError("Invalid user.", REVIEW_ERROR)
            });
        const user = await getUser({id: req.userId});
        const where = (user.role === 'admin' && slug) ? { location: reviewLocation, user: (await getUser({slug})) } : { location: reviewLocation, user };
        return (await orm
            .manager    
            .getRepository(Review)
            .delete(where)).affected;
    }
    throw AuthError("You must be authenticated to perform this action.");
}