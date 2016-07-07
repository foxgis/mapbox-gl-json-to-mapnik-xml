/*
 * Purpose:Merge two object to one
 * DATE:2016-6-14
 * Parameters:
 ** @destination:Objectthe first object and the object to merge to
 ** @source:Objectthe second object
 * Return:
 Object
 */
var extend = function(destination, source) {
    if (destination && source) {
      for (var property in source) {
        destination[property] = source[property]
      }
      return destination
    } else if (source && (!destination)) {
      return source
    } else if (destination && (!source)) {
      return destination
    }
  }
  /*
   * Purpose:check whether the object is Empty(obj={} in js)
   * DATE:2016-6-14
   * Parameters:
   ** @e:Object
   * Return:
   Boolen,if e is an empty object,return true.
   */

var isEmptyObject = function(e) {
  var t
  for (t in e)
    return !1
  return !0
}

function toHex(num) {
  var rs = ""
  var temp
  while (num / 16 > 0) {
    temp = num % 16
    rs = (temp + "").replace("10", "a").replace("11", "b").replace("12", "c").replace("13", "d").replace("14", "e").replace("15", "f") + rs
    num = parseInt(num / 16)
  }
  //console.warn(rs)°°°°//¥Ú”°
  return rs
}

exports.extend = extend
exports.isEmptyObject = isEmptyObject
exports.toHex = toHex
