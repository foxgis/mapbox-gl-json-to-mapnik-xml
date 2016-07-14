var url = require('url')
//defaults
var bounds = '-180,-85.0511,180,85.0511',
  center = '0,0,0',
  format = 'png8:m=h',
  minzoom = 0,
  maxzoom = 20

function getParameters(obj) {
  var source_str = source(obj.sources)
  var Parameters = {
    Parameters: {
      Parameter: [
        { '@name': 'bounds', '#text': bounds },
        { '@name': 'center', '#text': center },
        { '@name': 'format', '#text': format },
        { '@name': 'minzoom', '#text': minzoom },
        { '@name': 'maxzoom', '#text': maxzoom },
        { '@name': 'source', '#cdata': source_str }
      ]
    }
  }

  return Parameters
}


/*
@sources:gl_json_obj.sources

return {String}
 */
function source(sources) {
  var source = ''
  var length = Object.getOwnPropertyNames(sources).length
  var count = 0
  for (var p in sources) {
    if (source == '') {
      //mark

      source += url.resolve(sources[p]['url']+'/', '{z}/{x}/{y}.vector.pbf')
    } else {
      var url_str = url.resolve(sources[p]['url']+'/', '{z}/{x}/{y}.vector.pbf')
      source += ',' + url_str
    }
    count++
    if (count >= length) {
      return source
    }
  }
}

exports.getParameters = getParameters
