/***
 * To run the tests, start the server first with npm run dev, then open another terminal and npm test
 * 
 * 
 */
import { it } from "mocha"
import chai from 'chai'
import { middleware} from '../middleware.js'
import verifyToken from "../auth/verifyToken.js";
import chaiAsPromised from 'chai-as-promised';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import {NextResponse} from 'next/server.js'
import sinon from 'sinon'
import fs from 'fs'

if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
  } else {
    dotenv.config();
  }

const ROOT_URL = "http://localhost:"+ process.env.PORT+"/"

const assert= chai.assert
const expect = chai.expect
const should = chai.should()

const INCORRECT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

chai.use(chaiAsPromised);

describe("verifyToken",function (){
    this.timeout(3000)
    it('should throw an error if token incorrect', ()=>{
        const token =INCORRECT_TOKEN
        expect(() => verifyToken(token)).to.throw(Error).and.have.property('message').that.includes('invalid signature');    
    })
    it('should pass if token is correct', ()=>{
        const token = jwt.sign({user:'admin'}, process.env.JWT_SECRET_KEY, {expiresIn: '1min',});
        expect(verifyToken(token)).to.equal('admin')    
    })
})

describe('middleware',()=>{
    it('should throw an error if no cookie is present', async ()=>{
        let headers = new Headers();
        const req = {
            headers:headers,
            url:ROOT_URL
        }
        await expect(middleware(req)).to.be.rejectedWith("Not authenticated, no cookies present")
    })
    it("should throw an error if the token isn't present",async ()=>{
        let headers = new Headers();
        headers.set('Cookie', 'token=; HttpOnly');
        const req = {
            headers: headers,
            url:ROOT_URL
        }
        await expect(middleware(req)).to.be.rejectedWith("Token not present in Cookie")
    })
    it("should throw an error if the token isn't correct",async ()=>{
        let headers = new Headers();
        headers.set('Cookie', 'token='+INCORRECT_TOKEN+'; HttpOnly');
        const req = {
            headers: headers,
            url: ROOT_URL,
          };
        await expect(middleware(req)).to.be.rejectedWith("Invalid token")
    })
    it("should throw an error if the token isn't correct",async ()=>{
        const req = {
            headers: new Headers({
                cookie: 'token='+INCORRECT_TOKEN
            }),
            url: ROOT_URL,
          };
        await expect(middleware(req)).to.be.rejectedWith("Invalid token")
    })
    it("should redirect if token is correct",async ()=>{
        const token = jwt.sign({user:'admin'}, process.env.JWT_SECRET_KEY, {expiresIn: '1min',});
        const req = {
            headers: new Headers({
                cookie: 'token='+token
            }),
            url: ROOT_URL,
          };
        await expect(middleware(req)).not.to.be.rejected

            // Create a sinon spy for NextResponse.next()
        const nextSpy = sinon.spy(NextResponse, 'next');

        // Call the function that contains NextResponse.next()
        // For example:
        const result = await middleware(req);

        // Assert that NextResponse.next() is called once
        expect(nextSpy.called).to.be.true;
        expect(nextSpy.callCount).to.equal(1);

        // Restore the original function after the test
        nextSpy.restore();

        }
    )
})

describe('login',function(){
    this.timeout(6000)
    it('should match passwords and return success',async ()=>{
        const response = await fetch(new URL('/api/login', ROOT_URL) , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password:process.env.MY_CLIENT_PASSWORD }),
          })
        const {success} = await response.json()
        expect(success).to.be.true
    })
    it('should not match passwords and return Credenciales inválidas with 401 status',async ()=>{
        const response = await fetch(new URL('/api/login', ROOT_URL) , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: 'dsadsa' }),
          })
        const data = await response.json()
        expect(data.error).to.be.equal('Credenciales inválidas')
        expect(response.status).to.be.equal(401)
    })
})

describe('keep-login',async()=>{
    it('should return an error if token cookie is missing, or the property "token" is not well set',async ()=>{
        const response = await fetch(new URL('/api/keep-login', ROOT_URL) , {
            method: 'POST',
            headers: new Headers({
                cookie: 'notoken=dsa'
            })
          })
        const data = await response.json()
        console.log(data)
        expect(data.error).to.be.equal('token cookie missing')
        expect(response.status).to.be.equal(401)
    })
    it('should respond success on correct token httponly cookie',async ()=>{
        const token = jwt.sign({user:'admin'}, process.env.JWT_SECRET_KEY, {expiresIn: '1min',});
        const response = await fetch(new URL('/api/keep-login', ROOT_URL) , {
            method: 'POST',
            headers: new Headers({
                cookie: 'token='+token
            })
          })
        const data = await response.json()
        console.log(data)
        expect(data.isValid).to.be.true
        expect(response.status).to.be.equal(200)
    })
})