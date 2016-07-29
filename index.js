var path = require('path')
var xmlbuilder = require('xmlbuilder')
var trans = require('./lib/Translate')
var style = require('./lib/style')
var parameter = require('./lib/Parameters')
var uti=require('./lib/uti')


var srs_mector = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 \
+x_0=0.0 +y_0=0.0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs +over"


var Map = function(srs, layer,markerUri) {
  var obj = {
    Map: {
      '@srs': srs || srs_mector,
      Parameters: {},
      Style: [],
      Layer: []
    }
  }
  var bj = trans.bgTranslate(layer,markerUri)
  for (var p in bj) {
    obj.Map[p] = bj[p]
  }

  return obj
}


function Style(layer, markerUri, callback) {
  style.getStyle(layer, markerUri, function(err, data) {
    if(err){
      callback(err);
    }
    if(data.length===0){
      callback(null, {});
    }
    var style1 = {
      '@name': layer.id,
      'Rule': data
    }
    callback(null, style1)
  })
}

function Layer(glayers) {
  var mlayers = []
  glayers.forEach(function(e) {
    if (e.type !== 'background') {
      var layer = {
        '@srs': srs_mector,
        '@name': e['source-layer'],
        'StyleName': e.id
      }
      mlayers.push(layer)
    }
  })
  return mlayers
}


function gl2xml(globj, callback) {
  var fontUri, markerUri
  var source_obj=globj.sources;
  if (globj.glyphs) {
    var font_url = globj.glyphs
    var start = font_url.indexOf('\/fonts')
    var str = font_url.slice(start, font_url.length)
    var arr = str.split('/')
    fontUri = path.resolve(path.join(arr[1], arr[2]))
  } else {
    fontUri = null
  }

  if (globj.sprite) {
    var marker_url = globj.sprite
    var start2 = marker_url.indexOf('\/sprites')
    var str2 = marker_url.slice(start, marker_url.length)
    var arr2 = str2.split('/')
    markerUri = path.resolve(path.join(arr2[1], arr2[2],arr2[3]))
  } else {
    markerUri = null
  }

  var mMap = {}
  var glayers = globj.layers
  var para = parameter.getParameters(globj)

  mMap = Map(srs_mector, glayers,markerUri)
  if (fontUri) {
    mMap.Map['@font-directory'] =fontUri.replace(/\\/g,'\/')
  }
  mMap.Map.Layer = Layer(glayers)
  mMap.Map.Style = []
  mMap.Map.Parameters = para.Parameters
  glayers.forEach(function(e) {
    if (e.type !== 'background'&&source_obj[e.source].type!=='video') {
      Style(e, markerUri, function(err, data) {
        if(err){console.log(err);callback(err);}
        if(!uti.isEmptyObject(data)){
          mMap.Map.Style.push(data)
        }
      })
    }
  })
  var xml = xmlbuilder.create(mMap).dec('1.0', 'UTF-8').end()
  callback(null, xml)
}

module.exports = gl2xml
