
/*
import { it } from "mocha"
import chai from 'chai'
const assert= chai.assert
const expect = chai.expect
const should = chai.should()

//test suite
describe('Dummy test',()=>{
    let name = 'Jhon'
    //hooks: 4  1 before() -> 2 beforeEach() -> (test()) -> 3 afterEach() -> 4 after()
    before(()=>{
        console.log('before hook')
    })

    after(()=>{
        console.log('after hook')
    })

    beforeEach(()=>{
        console.log('before Each hook')
    })

    //test case
    it('should be a string',()=>{
        name.should.be.a('string')
        expect(name).to.be.a('string')
        assert.typeOf(name,'string')
    })
    //it.skip
    //it.only
    it('should contain Jhon',()=>{
        name.should.not.be.equal('Kate')
        assert.equal(name,'Jhon')
        name.should.be.equal('Jhon')
        expect(name).to.be.equal('Jhon')
    })

})

*/