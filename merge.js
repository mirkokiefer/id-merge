
var arrayMerge = require('array-merge')
var _ = require('underscore')
var Stream = require('token-streams').TokenStream
var StreamCollection = require('token-streams').TokenStreamCollection

var ignoreAllDeletes = function(diff) {
  return diff.map(function(each) {
    return each[0] == '-' ? ['=', each[1]] : each
  })
}

var merge = function(diffs) {
  var diffIDs = diffs.map(function(each) { return ignoreAllDeletes(each.ids) })
  var mergedIDs = arrayMerge(diffIDs)

  var valueDiffStreams = diffs.map(function(each) {
    var tokens = _.map(each.values, function(entry, id) {
      return {type: entry[0], value: {id: id, value: [entry[1], entry[2]]}}
    }).sort(function(a, b) { return a.value.id > b.value.id })
    return new Stream(tokens)
  })
  var valueDiffStreamCol = new StreamCollection(valueDiffStreams)

  var mergedValues = {}
  var valueConflicts = []

  valueDiffStreamCol.onAll('=', function() {
    var id = valueDiffStreams[0].token.value.id
    mergedValues[id] = valueDiffStreams[0].token.value.value[0]
    valueDiffStreamCol.next()
  })

  valueDiffStreamCol.onSome(['m', '-'], function(modifyingStreamCol) {
    var id = modifyingStreamCol.streams[0].token.value.id
    var newValues = _.uniq(modifyingStreamCol.streams.map(function(each) {
      return each.token.type == 'm' ? each.token.value.value[1] : null
    }))
    if(newValues.length > 1) {
      valueConflicts.push(id)
      mergedValues[id] = newValues
    } else if(newValues[0] !== null) {
      mergedValues[id] = newValues[0]
    }
    valueDiffStreamCol.next()
  })

  valueDiffStreamCol.onSome(['+'], function(addingStreamCol) {
    var id = addingStreamCol.streams[0].token.value.id
    mergedValues[id] = addingStreamCol.streams[0].token.value.value[0]
    valueDiffStreamCol.next()
  })

  valueDiffStreamCol.emit()

  return {
    valueConflicts: valueConflicts, values: mergedValues,
    orderConflicts: mergedIDs.conflict, order: mergedIDs.result
  }
}

module.exports = merge