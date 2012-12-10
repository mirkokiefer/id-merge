
var assert = require('assert')
var merge = require('./merge')

var origin = [
  {id: 1, value: 1},
  {id: 2, value: 2},
  {id: 3, value: 3},
  {id: 4, value: 4}
]
var modified1 = [
  {id: 5, value: 6},
  {id: 3, value: 8},
  {id: 2, value: 2},
  {id: 4, value: 4},
  {id: 1, value: 5}
]
var modified2 = [
  {id: 2, value: 2},
  {id: 1, value: 9},
  {id: 4, value: 5}
]

var diff1Expected = {
  values: {
    1: ['m', 1, 5],
    2: ['=', 2],
    3: ['m', 3, 8],
    4: ['=', 4],
    5: ['+', 6]
  },
  ids: [["x",1],["x",2],["+",5],["=",3],["p",2],["=",4],["p",1]]
}
var diff2Expected = {
  values: {
    1: ['m', 1, 9],
    2: ['=', 2],
    3: ['-', 3],
    4: ['m', 4, 5]
  },
  ids: [["x",1],["=",2],["-",3],["p",1],["=",4]]
}

var mergeExpected = {
  valueConflicts: [1, 3],
  values: {
    1: [5, 9],
    2: 2,
    3: [8, null],
    4: 5,
    5: 6
  },
  orderConflicts: true,
  order: [
    [5, 3, 2, 4, 1],
    [5, 3, 2, 1, 4]
  ]
}

describe('id-merge', function() {
  it('should merge based on the diffs', function() {
    var merged = merge(diff1Expected, diff2Expected)
    assert.deepEqual(merged, mergeExpected)
  })
})

