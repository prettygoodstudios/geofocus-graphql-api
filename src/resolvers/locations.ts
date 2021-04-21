type APILocation = {
    name: String 
    latitude: Number
    longitude: Number,
    city: String,
    state: String,
    address: String
}

export const locations = (): APILocation[] => {
    return [
        {
            name: "Hello World",
            latitude: 100,
            longitude: 40,
            city: "Orem",
            state: "Utah",
            address: "Center Street"
        },
        {
            name: "Hello World",
            latitude: 100,
            longitude: 40,
            city: "Orem",
            state: "Utah",
            address: "Center Street"
        }
    ];
}