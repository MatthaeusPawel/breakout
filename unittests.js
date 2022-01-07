import { equal, deepEqual } from 'assert';
import * as breakout from './main.js';
//const breakoutname = './main.js';
//const breakout = require(breakoutname);

//breakout.computeNewDirection();
describe('AngleCalculation', () => {
  it('Right', () => {
        equal(breakout.computeAngle(1, 0), 0); });
  it('Left', () => {
        equal(breakout.computeAngle(-1, 0), Math.PI); });
  it('Top', () => {
        equal(breakout.computeAngle(0, 1), 3*Math.PI/2); });
  it('Bottom', () => {
        equal(breakout.computeAngle(0, -1), Math.PI/2); });
  it('NW', () => {
        equal(breakout.computeAngle(-1, -1), 5*Math.PI/4); });
  it('SW', () => {
        equal(breakout.computeAngle(-1, 1), 3*Math.PI/4); });
  it('NE', () => {
        equal(breakout.computeAngle(1, -1), 7*Math.PI/4); });
  it('SE', () => {
        equal(breakout.computeAngle(1, 1), Math.PI/4); });
});


describe('Quantize', () => {
 [0, 0.2, 0.6, 0.9, 1].forEach( (x) =>  it('trivial test for '+x, () => {
    equal(breakout.quantize(x, 0, 1, 1), 0)}));
 [0, 0.1, 0.2, 0.3].forEach( (x) =>  it('lower end test for '+x, () => {
    equal(breakout.quantize(x, 0, 1, 3), 0)}));
 [0.4, 0.5, 0.6].forEach( (x) =>  it('middle test for '+x, () => {
    equal(breakout.quantize(x, 0, 1, 3), 1)}));
 [0.7, 0.8, 0.9, 1].forEach( (x) =>  it('higher end test for '+x, () => {
    equal(breakout.quantize(x, 0, 1, 3), 2)}));
})
;

describe('State Array', () => {
  it('initialize 1 dimensions', () => {
    deepEqual(breakout.initializeArray([4]), [0,0,0,0]);
  });
  it('initialize 2 dimensions', () => {
    deepEqual(breakout.initializeArray([2,2]), [[0,0],[0,0]]);
  });
  it('initialize 3 dimensions', () => {
    deepEqual(breakout.initializeArray([1,2,3]), [[[0,0,0],[0,0,0]]]);
  });
  it('initialize 3 dimensions', () => {
    deepEqual(breakout.initializeArray([4,2,3]), [[[0,0,0],[0,0,0]],[[0,0,0],[0,0,0]],[[0,0,0],[0,0,0]],[[0,0,0],[0,0,0]]]);
  });
});


describe('argmax', () => {
  it('Empty Array', () => {
    equal(typeof breakout.argmax([]), "undefined");
  });
  it('Singelton', () => {
    equal(breakout.argmax([2]), 0);
  });
  it('Usual Case', () => {
    equal(breakout.argmax([0.5, 1.5, 9]), 2);
  });
});

describe('recoverRange', () => {
  it('trivial', () => {
      deepEqual(breakout.recoverRange(0, 0, 2 * Math.PI, 1), [0, 2*Math.PI]);
  });
  
  it('third for Pi', () => {
      deepEqual(breakout.recoverRange(0, 0, 2 * Math.PI, 3), [0, 2*Math.PI/3]);
      deepEqual(breakout.recoverRange(1, 0, 2 * Math.PI, 3), [2*Math.PI/3, 4*Math.PI/3]);
      deepEqual(breakout.recoverRange(2, 0, 2 * Math.PI, 3), [4*Math.PI/3, 2*Math.PI]);
  });
  
  [0,1,2,3,4,5].forEach( (x) => it('inverse to quantize ' + x, () =>{
    equal( breakout.quantize(breakout.recoverRange(x, 0, 2*Math.PI, 7)[0]/2 + breakout.recoverRange(x, 0, 2*Math.PI, 7)[1]/2, 0, 2*Math.PI, 7), x);
  }
  ));
});