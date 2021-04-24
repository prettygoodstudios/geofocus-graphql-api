import {gql} from "apollo-server";

const typeDefs = gql`
    type Location {
        title: String, 
        latitude: Float,
        longitude: Float,
        city: String,
        state: String,
        address: String,
        photos: [Photo],
        slug: String
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
        profile_url: String,
        photos: [Photo]
    }

    type Query {
        locations: [Location],
        location(slug: String): Location,
        photo(slug: String): Photo, 
        users: [Profile]
    }
`;

export default typeDefs;