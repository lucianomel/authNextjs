import jwt from 'jsonwebtoken';
import 'dotenv/config'


export default function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
      // Verify the session token
      const decoded = jwt.verify(token, secretKey);
      if (decoded.user) {
        // Session token is valid
        return res.status(200).json({ isValid: true });
      }
    } catch (error) {
      //console.error('Error verifying session token:', error);
      return res.status(401).json({message:'Error verifying session token'})
    }
  }

  // Invalid session token or invalid request method
  return res.status(401).json({ isValid: false });
}
