function Filter(filter, callback) {
  if (filter) {
    if (typeof filter[0] == 'string') {
      var type = filter[0]
      if (ops[type] !== undefined) {
        operatorFilter(filter, function(err, result) {
          callback(null, result)
        })
      } else if (type == 'in' || type == '!in') {
        membershipFilter(filter, function(err, result) {
          callback(null, result)
        })
      } else if (type == 'all' || type == 'any' || type == 'none') {
        combiningFilter(filter, function(err, result) {
          callback(null, result)
        })
      }
    }
  }
}

var ops = {
  '<': ' &lt ',
  '>': ' &gt ',
  '==': ' = ',
  '!=': ' != ',
  '<=': ' &lt= ',
  '>=': ' &gt= '
}

//Comparison Filters(> , < , = , >= , <=)
function operatorFilter(filter, callback) {
  var xml_filter = ''
  var field_name = '\[' + getKey(filter[1]) + '\]'
  var op = ops[filter[0]]
  if (op) {
    xml_filter = field_name + ops[filter[0]] + getValue(filter[2])
  } else {
    console.log("Error:" + "operatorFilter:No Match operator!!!")
  }
  var data = '\( ' + xml_filter + ' \)'

  callback(null, data)
}

//Set Membership Filters(in , !in)
function membershipFilter(filter, callback) {
  var xml_filter = ''
  var field_name = '\[' + getKey(filter[1]) + '\]'
  var count = 0
  if (filter[0] == 'in') {
    filter.splice(0, 2)
    filter.forEach(function(e) {
      if (xml_filter.trim().length > 0) {
        xml_filter += ' or ' + field_name + ' = ' + getValue(e)
      } else {
        xml_filter += field_name + ' = ' + getValue(e)
      }
      count++
      if (count >= filter.length) {
        callback(null, '\( ' + xml_filter + ' \)')
      }
    })
  } else if (filter[0] == '!in') {
    filter.splice(0, 2)
    filter.forEach(function(e) {
      if (xml_filter.trim().length > 0) {
        xml_filter += ' and ' + field_name + ' != ' + getValue(e)
      } else {
        xml_filter += field_name + ' != ' + getValue(e)
      }
      count++
      if (count >= filter.length) {
        callback(null, '\( ' + xml_filter + ' \)')
      }
    })
  }
}

function combiningFilter(filter, callback) {
  var xml_filter = ''
  var type = filter[0]

  if (type == 'all') {
    var link_word = ' and '
  } else if (type == 'any') {
    var link_word = ' or '
  } else if (type == 'none') {
    var link_word = ' not'
  }
  filter.splice(0, 1)
  filter.forEach(function(e) {
    if (e instanceof Array) {
      var str
      Filter(e, function(err, result) {
        str = result
        if (type == 'none') {
          str = link_word + str
        } else if (type !== 'none' && (xml_filter.trim().length > 0)) {
          str = link_word + str
        }
        xml_filter += str
      })
    }
  })
  callback(null, xml_filter)
}

function getKey(k) {
  if (k == '$type') {
    return 'mapnik::geometry_type'
  } else {
    return k
  }
}

function getValue(v) {
  if (typeof v == 'string') {
    return '"' + v + '"'
  } else {
    return v
  }
}

//test
//var filter=['all',['==','class','road'],['in','name','a','b','c'],['all',['>=','length',100],['in','area',10,3]]]
//var filter=[
//    "all",
//    [
//        "==",
//        "$type",
//        "LineString"
//    ],
//    [
//        "none",
//        [
//            "in",
//            "class",
//            "motorway_link",
//            "street",
//            "street_limited",
//            "service",
//            "track",
//            "pedestrian",
//            "path",
//            "link"
//        ],
//        [
//            "==",
//            "structure",
//            "bridge"
//        ]
//    ]
//]
//var result=Filter(filter)
//console.log(result)

exports.Filter = Filter
