import {gql} from "apollo-server-express";

const typeDefs = gql`
    type Location {
        title: String, 
        latitude: Float,
        longitude: Float,
        city: String,
        state: String,
        address: String,
        photos: [Photo],
        slug: String,
        user: Profile
        country: String,
        reviews: [Review]
    }

    type Photo {
        caption: String,
        views: Int,
        location: Location,
        slug: String,
        width: Float,
        height: Int,
        zoom: Float,
        offsetX: Int,
        offsetY: Int,
        user: Profile,
        url: String
    }

    type Profile {
        slug: String,
        display: String,
        zoom: Float, 
        height: Float,
        width: Float,
        bio: String,
        offsetX: Float,
        offsetY: Float,
        profile_url: String,
        photos: [Photo]
    }


    type PrivateUserData {
        slug: String,
        display: String,
        zoom: Float, 
        height: Float,
        width: Float,
        bio: String,
        offsetX: Float,
        offsetY: Float,
        profile_url: String,
        photos: [Photo],
        email: String,
        role: String
    }

    type Review {
        score: Float,
        message: String,
        location: Location,
        user: Profile,
        slug: String
    }

    type Report {
        message: String,
        location: Location,
        photo: Photo,
        review: Review,
        slug: String,
        id: Int
    }

    type Query {
        locations: [Location],
        location(slug: String): Location,
        photo(slug: String): Photo, 
        topUsers: [Profile],
        user(slug: String): Profile,
        me: PrivateUserData,
        reviews(slug: String): [Review],
        reports: [Report]
    }

    type Mutation {
        login(email: String, password: String): PrivateUserData,
        logout: Boolean,
        createLocation(title: String, address: String, city: String, state: String, country: String): Location
        updateLocation(title: String, address: String, city: String, state: String, country: String, slug: String): Location
        deleteLocation(slug: String): Int
        upload(file: Upload!, width: Float, height: Float, offsetX: Float, offsetY: Float, caption: String, location: String, zoom: Float): Photo,
        deletePhoto(slug: String): Int
        register(email: String, password: String, display: String, bio: String, file: Upload, width: Float, height: Float, offsetX: Float, offsetY: Float, zoom: Float): PrivateUserData
        editProfile(slug: String, email: String, password: String, display: String, bio: String, file: Upload, width: Float, height: Float, offsetX: Float, offsetY: Float, zoom: Float): PrivateUserData,
        review(location: String, message: String, score: Float, user: String): Review
        deleteReview(location: String, user: String): Int
        report(message: String, location: String, review: String, photo: String): Report,
        deleteReport(id: Int): Int,
    }
`;

export default typeDefs;