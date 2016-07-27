var url = require('url')
//defaults
var bounds = '-180,-85.0511,180,85.0511',
  center = '0,0,0',
  format = 'png8:m=h',
  minzoom = 0,
  maxzoom = 20

function getParameters(obj) {
  var source_obj=obj.sources;
  var glayers=obj.layers

  var source_layer={};
  var count= 0,counts=glayers.length;
  glayers.forEach(function(e){
    if (e.type !== 'background'&&source_obj[e['source']].type!=='video') {
      var source_str = source(source_obj[e['source']])
      source_layer[e['source-layer']]=source_str
    }
    count++;
  })

  if(count>=counts){
    var Parameters = {
      Parameters: {
        Parameter: [
          { '@name': 'bounds', '#text': bounds },
          { '@name': 'center', '#text': center },
          { '@name': 'format', '#text': format },
          { '@name': 'minzoom', '#text': minzoom },
          { '@name': 'maxzoom', '#text': maxzoom },
          { '@name': 'source', '#cdata': JSON.stringify(source_layer)}
        ]
      }
    }

    return Parameters
  }
}


/*
@sources:gl_json_obj.sources

return {String}
 */
function source(sources) {
  var source=decodeURIComponent(url.resolve(sources['url']+'\/','\{z\}\/\{x\}\/\{y\}.vector.pbf'));
  return source
}

exports.getParameters = getParameters
