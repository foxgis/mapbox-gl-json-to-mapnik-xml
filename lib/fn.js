var glfun = require('mapbox-gl-function').interpolated

function fun2zoom(obj,z) {
  if(obj.type==undefined ){
    if(typeof obj.stops[0][1]!=='number'){obj.type='interval';}
    else{obj.type='exponential';}
  }
  var exponential = glfun(obj)
  var value=exponential(z);
  return value;
}

exports.fun2zoom = fun2zoom
