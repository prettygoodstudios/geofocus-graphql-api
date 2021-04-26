import { sign } from "jsonwebtoken";
import { SECRET } from "./config";
import User from "./models/user";


export const generateTokens = (user: User, res: any) => {
    const tokenObject = {
        userId: user.id,
        userEmail: user.email,
        userSlug: user.slug
    }

    const refresh = sign(tokenObject, SECRET, {
        expiresIn: "7d"
    });

    const auth = sign(tokenObject, SECRET, {
        expiresIn: "15min"
    });

    res.cookie("refresh-token", refresh);
    res.cookie("auth-token", auth);
}

export const clearTokens = (res: any) => {
    res.cookie("refresh-token", "");
    res.cookie("auth-token", "");
}