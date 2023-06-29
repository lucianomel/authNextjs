import { NextResponse } from 'next/server.js';
import { parse } from 'cookie';

export async function middleware(request) {
  const { headers, url } = request;

  const cookieHeader = headers.get('cookie');
  if(!cookieHeader){
    const error = new Error("Not authenticated")
    error.status=401
    throw error
  }
  let token
  try{
    const cookies = parse(cookieHeader || '');
    token = cookies.token;
  }catch(e){
    console.log(e)
    const error = new Error("Auth cookie not present")
    throw error
  }
  //console.log("cookie: ",token)

  if (
    request.url === '/login' ||
    request.url.endsWith('/api/login') ||
    request.url.endsWith('/api/verify-session-token') ||
    request.url.endsWith('/api/keep-login')
  ) {
    return NextResponse.next();
  }

  if (token) {
    const response = await fetch(new URL('/api/verify-session-token', request.url) , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    const { isValid } = await response.json()
    if(!isValid){
      throw new Error("Invalid token")
    }
    if (response.ok && isValid) {
      return NextResponse.next();
    } else {
      const responseBody = await response.text();
      console.error('Error verifying session token:', responseBody);
    }
  }else{
    const error = new Error("Token not present in Cookie")
    error.status=401
    throw error
  }
  console.log("no token, redirecting to /login")

  return NextResponse.redirect(new URL('/login', request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};
