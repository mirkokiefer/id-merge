
var assert = require('assert')
var merge = require('./merge')
var diff = require('id-diff')

var origin = [
  {id: 1, value: 1},
  {id: 2, value: 2},
  {id: 3, value: 3},
  {id: 4, value: 4},
  {id: 5, value: 5}
]
var modified1 = [
  {id: 6, value: 6},
  {id: 3, value: 8},
  {id: 2, value: 2},
  {id: 4, value: 4},
  {id: 5, value: 5},
  {id: 1, value: 5}
]
var modified2 = [
  {id: 2, value: 2},
  {id: 1, value: 9},
  {id: 4, value: 5}
]
var modified3 = [
  {id: 1, value: 10},
  {id: 2, value: 2},
  {id: 4, value: 4},
]

var diff1 = diff(origin, modified1)
var diff2 = diff(origin, modified2)
var diff3 = diff(origin, modified3)

var mergeExpected = {
  valueConflicts: [1, 3],
  values: {
    1: [5, 9, 10],
    2: 2,
    3: [8, null],
    4: 5,
    6: 6
  },
  orderConflicts: true,
  order: [
    [6, 3, 2, 4, 1],
    [6, 3, 1, 2, 4],
    [1, 6, 3, 2, 4]
  ]
}

describe('id-merge', function() {
  it('should merge based on the diffs', function() {
    var merged = merge([diff1, diff2, diff3])
    console.log(merged)
    assert.deepEqual(merged, mergeExpected)
  })
})

