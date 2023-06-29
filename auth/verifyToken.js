import jwt from 'jsonwebtoken';
import 'dotenv/config'

const secretKey = process.env.JWT_SECRET_KEY;

export default function (tokenCookie){
    const decoded = jwt.verify(tokenCookie, secretKey);
    return decoded.user
}