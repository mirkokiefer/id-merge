#id-merge
3-way merging of arrays with identifyable objects.  
You just pass in the diffs to the original array using [id-diff's format](https://github.com/mirkok/id-diff).  
If you just need merging of plain arrays you can use [array-merge](https://github.com/mirkok/array-merge).

``` js
var merge = require('id-merge')
var diff = require('id-diff')
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

var result = merge(diff(origin, modified1), diff(origin, modified2))
// returns:
{
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
```