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
        country: String
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
        email: String
    }

    type Query {
        locations: [Location],
        location(slug: String): Location,
        photo(slug: String): Photo, 
        topUsers: [Profile],
        user(slug: String): Profile,
        me: PrivateUserData
    }

    type Mutation {
        login(email: String, password: String): Profile,
        logout: Boolean,
        createLocation(title: String, address: String, city: String, state: String, country: String): Location
        updateLocation(title: String, address: String, city: String, state: String, country: String, slug: String): Location,
        upload(file: Upload!): Photo
    }
`;

export default typeDefs;