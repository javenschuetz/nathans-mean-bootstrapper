'use strict';

const assert = require('chai').assert;

describe('no module', function(){

  it('should pass', function(){
    const foo = 1;

    const actual = foo;
    const expected = 1;

    assert.equal(expected, actual,
    '1 should equal 1');
  });


  it('should deep equals demo', function(){
    let foo = {
      bar: {
        baz: 2
      },
      quux: 3
    };

    var actual = foo;
    var expected = {
      bar: {
        baz: 2
      },
      quux: 3
    };

    assert.deepEqual(expected, actual,
    'testing deep equals!');
  });

});
