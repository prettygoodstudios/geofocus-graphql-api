import {gql} from "apollo-server";

const typeDefs = gql`
    type Location {
        title: String, 
        latitude: Float,
        longitude: Float,
        city: String,
        state: String,
        address: String
    }
    type Query {
        locations: [Location]
    }
`;

export default typeDefs;