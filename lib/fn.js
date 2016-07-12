var glfun = require('mapbox-gl-function').interpolated

function fun2zoom(obj) {
  var exponential = glfun(obj)
  var length = obj.stops.length
  var minzoom = obj.stops[0][0]
  var maxzoom = obj.stops[length - 1][0]
  var z = minzoom
  var stop = {}
  while (z <= maxzoom) {
    stop[z] = exponential(z)
    z++
  }
  return [stop, minzoom, maxzoom]
}

exports.fun2zoom = fun2zoom
