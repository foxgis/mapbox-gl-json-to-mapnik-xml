
function Filter(filter, callback) {
  if (filter) {
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
    else{
      console.log(filter)
      callback(null,'');
    }

  }
  else{
    //console.log("there is no filter")
    callback(null,'');
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
    callback("Filter Error:" + "No Match operator!!!")
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
    for(var i=2;i<filter.length;i++){
      var filter_item=filter[i];
      if (xml_filter.trim().length > 0) {
        xml_filter += ' or ' + field_name + ' = ' + getValue(filter_item)
      } else {
        xml_filter += field_name + ' = ' + getValue(filter_item)
      }
      count++
      if (count >= filter.length-2) {
        callback(null, '\( ' + xml_filter + ' \)')
      }
    }

  }
  else if (filter[0] == '!in') {
    for(var i=2;i<filter.length;i++){
      var filter_item=filter[i];
      if (xml_filter.trim().length > 0) {
        xml_filter += ' and ' + field_name + ' != ' + getValue(filter_item)
      } else {
        xml_filter += field_name + ' != ' + getValue(filter_item)
      }
      count++
      if (count >= filter.length-2) {
        callback(null, '\( ' + xml_filter + ' \)')
      }
    }
  }
}

function combiningFilter(filter, callback) {
  //console.log(filter);
  var xml_filter = ''
  var type = filter[0]

  if (type === 'all') {
    var link_word = ' and '
  } else if (type === 'any') {
    var link_word = ' or '
  } else if (type === 'none') {
    var link_word = ' not'
  }
  //filter.splice(0, 1)
  filter.forEach(function(e) {
    if (e instanceof Array) {
      var str
      Filter(e, function(err, result) {
        str = result
        if (type === 'none') {
          str = link_word + str
        } else if (type !== 'none' && (xml_filter.trim().length > 0)) {
          str = link_word + str
        }
        xml_filter += str
      })
    }
  })
 // console.log(xml_filter);
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


exports.Filter = Filter
