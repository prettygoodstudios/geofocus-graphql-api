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
        img_url: String
        location: Location,
        slug: String,
        width: Float,
        height: Int,
        zoom: Float,
        offsetX: Int,
        offsetY: Int
    }

    type Query {
        locations: [Location]
    }
`;

export default typeDefs;