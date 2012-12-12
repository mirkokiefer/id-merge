
var arrayMerge = require('array-merge')
var _ = require('underscore')

var ignoreAllDeletes = function(diff) {
  return diff.map(function(each) {
    return each[0] == '-' ? ['=', each[1]] : each
  })
}

var merge = function(diff1, diff2) {
  var diff1IDs = ignoreAllDeletes(diff1.ids)
  var diff2IDs = ignoreAllDeletes(diff2.ids)
  var mergedIDs = arrayMerge([diff1IDs, diff2IDs])
  var mergedValues = {}
  var valueConflicts = []
  _.each(diff1.values, function(diff1Entry, id) {
    var diff2Entry = diff2.values[id] || ['0']
    var modifier = diff1Entry[0] + diff2Entry[0]
    if(modifier == '==') return mergedValues[id] = diff1Entry[1]
    if(modifier == '=m') return mergedValues[id] = diff2Entry[2]
    if(modifier == 'm=') return mergedValues[id] = diff1Entry[2]
    if(modifier == 'mm') {
      valueConflicts.push(id)
      return mergedValues[id] = [diff1Entry[2], diff2Entry[2]]
    }
    if(modifier == '+0') return mergedValues[id] = diff1Entry[1]
    if(modifier == '-=') return
    if(modifier == '--') return
    if(modifier == '-m') {
      valueConflicts.push(id)
      return mergedValues[id] = [null, diff2Entry[2]]
    }
    if(modifier == 'm-') {
      valueConflicts.push(id)
      return mergedValues[id] = [diff1Entry[2], null]
    }
  })
    
  _.each(diff2.values, function(diff2Entry, id) {
    if(diff2Entry[0] == '+') mergedValues[id] = diff2Entry[1]
  })
  return {
    valueConflicts: valueConflicts, values: mergedValues,
    orderConflicts: mergedIDs.conflict, order: mergedIDs.result
  }
}

module.exports = merge