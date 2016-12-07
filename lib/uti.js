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

var deepCopy=function (obj) {
  var result={};
  for(var p in obj){
    if(obj[p] instanceof Object&&!(obj[p] instanceof Array)){
      result[p]=deepCopy(obj[p]);
    }
    else{
      result[p]=obj[p];
    }
  }
  return result;

}

function contains(array, element) {
  var i = array.length;

  while (i--) {
    if (array[i] === element) {
      return true;
    }
  }

  return false;
}



exports.extend = extend
exports.isEmptyObject = isEmptyObject
exports.contains=contains;
exports.deepCopy=deepCopy;
