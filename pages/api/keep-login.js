import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default function handler(req, res) {
  if (req.method === 'POST') {
    if (!req.headers){
      throw new Error('No headers')
    }
    const { headers } = req;
    if(!headers.cookie){
      throw new Error('No cookies')
    }
    let cookies
    try{
      cookies = parse(headers.cookie)
    }catch(e){
      console.log(e)
      throw new Error('Error in parsing cookie')
    }
    const tokenCookie = cookies.token;
    if (!tokenCookie) {
      // Token cookie is missing, user is not authenticated
      return res.status(401).json({ error: 'token cookie missing' });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    try {
      // Verify the session token
      const decoded = jwt.verify(tokenCookie, secretKey);

      if (decoded.user) {
        // Session token is valid, user is authenticated
        return res.status(200).json({ isValid: true });
      }
    } catch (error) {
      console.error('Error verifying session token:', error);
    }
  }

  // Invalid session token or invalid request method
  return res.status(401).json({ isValid: false });
}
