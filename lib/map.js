function bgMap(key) {
  switch (key) {
    case 'background-color':
      return '@background-color'
    case 'background-pattern':
      return '@background-image'
      //NOTE
    case 'background-opacity':
      return '@background-opacity'
    default:
      return ''
  }
}

//type='symbol' and to_symbol=MarkersSymbolizer

function symbolMap(key) {
  switch (key) {
    case 'symbol-placement':
      return '@placement'

    case 'symbol-spacing':
      return '@spacing'

    case 'icon-allow-overlap':
      return '@allow-overlap'

    case 'icon-ignore-placement':
      return '@ignore-placement'

    case 'icon-opacity':
      return '@opacity'

    case 'icon-color':
      return '@fill'

    case 'icon-image':
      return '@file'

    default:
      return ''
  }
}

//type='symbol' and to_symbol=TextSymbolizer

function textMap(key) {
  switch (key) {
    //case 'text-rotation-alignment':
    //    return '@rotate-displacement'

    case 'text-field':
      return '#cdata'

    case 'text-font':
      return '@face-name'

    case 'text-size':
      return '@size'

    case 'text-max-width':
      return '@wrap-width'

    case 'text-line-height':
      return '@line-spacing'

    case 'text-letter-spacing':
      return '@character-spacing'

    case 'text-justify':
      return '@justify-alignment'

    case 'text-max-angle':
      return '@max-char-angle-delta'

    case 'text-rotate':
      return '@orientation'

    case 'text-transform':
      return '@text-transform'

      //case 'text-offset':
      //    return '@'

    case 'text-allow-overlap':
      return '@allow-overlap'

    case 'text-opacity':
      return '@opacity'

    case 'text-color':
      return '@fill'

    case 'text-halo-color':
      return '@halo-fill'

    case 'text-halo-width':
      return '@halo-radius'

    case 'text-translate':
      return '@displacement'

    default:
      return ''
  }
}

//type='line'
function lineMap(key) {
  switch (key) {
    case 'line-cap':
      return '@stroke-linecap'
    case 'line-join':
      return '@stroke-linejoin'
    case 'line-miter-limit':
      return '@stroke-miterlimit'
    case 'line-opacity':
      return '@stroke-opacity'
    case 'line-color':
      return '@stroke'
    case 'line-width':
      return '@stroke-width'
    case 'line-dasharray':
      return '@stroke-dasharray'
    case 'line-offset':
      return '@offset'
    case 'line-pattern':
      return '@file'
    default:
      return ''
  }

}
//type='fill'
function fillMap(key) {
  switch (key) {
    case 'fill-opacity':
      return '@fill-opacity'
    case 'fill-color':
      return '@fill'
    case 'fill-pattern':
      return '@file'

    default:
      return ''


  }
}
//type='raster'
function rasterMap(key) {
  switch (key) {
    case 'raster-opacity':
      return '@opacity'
    default:
      return ''
  }
}
//type='circle'
function circleMap(key) {
  switch (key) {
    //case 'circle-radius':
    //    return '@width'
    case 'circle-color?':
      return '@fill'
    case 'circle-opacity':
      return '@opacity'
    default:
      return ''
  }
}

exports.symbolMap = symbolMap
exports.textMap = textMap
exports.lineMap = lineMap
exports.fillMap = fillMap
exports.rasterMap = rasterMap
exports.circleMap = circleMap
exports.bgMap = bgMap
