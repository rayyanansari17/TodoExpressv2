import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function encrypt(user)
{
    try {
        return await jwt.sign(user, process.env.JWT_SECRET, {expiresIn: "1D"});
    } catch (error) {
        console.log(error);
    }
}

export {encrypt};