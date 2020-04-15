'use strict';
const { expect } = require('chai');

describe('Demo test', () => {
 
    const sum = (a,b) => a + b;    

    it(`sum(10, 10) should return 20`, () => {    
    
        expect(20).to.equal(sum(10,10));
    });
});