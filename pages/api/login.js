import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export default async function login(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const API_PASSWORD = Buffer.from(process.env.API_PASSWORD, 'base64').toString();

  // Extract the password from the request body
  const { password } = req.body;
  // Compare the entered password with the hashed API password
  const passwordsMatch = await bcrypt.compare(password, API_PASSWORD);
  console.log('Password match:', passwordsMatch);

  if (passwordsMatch) {
    try {
      // Authentication successful, generate a JWT session token
      const token = jwt.sign({ user: 'admin' }, JWT_SECRET_KEY, { expiresIn: '1d' });

      // Set the token as an HTTP-only cookie
      const expirationTime = new Date();
      // Set expiration time to 24 hr from now
      expirationTime.setTime(expirationTime.getTime() + 60 * 1000 * 60 * 24 ); 
      
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Expires=${expirationTime.toUTCString()}`);

      // Send a success response
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error generating JWT token:', error);
      res.status(500).json({ error: 'Error interno de servidor' });
    }
  } else {
    // Authentication failed
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
}
