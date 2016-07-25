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
    //5
    case 'icon-allow-overlap':
      return '@allow-overlap'

    case 'icon-ignore-placement':
      return '@ignore-placement'

    case 'icon-opacity':
      return '@opacity'

    case 'icon-color':
      return '@fill'
    //special key-value 6


    case 'icon-size':
      return 'icon-size'

    case 'icon-image':
      return 'icon-image'

    case 'icon-rotate':
      return 'icon-rotate'

    case 'icon-offset':
      return 'icon-offset'

    //case 'icon-translate':
    //      return 'icon-translate '

    default:
      return ''
  }
}

//type='symbol' and to_symbol=TextSymbolizer

function textMap(key) {
  switch (key) {
    //8
    case 'text-justify':
      return '@justify-alignment'



    case 'text-transform':
      return '@text-transform'

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

    case 'symbol-avoid-edges':
      return '@avoid-edges'

    //special 10
    case 'text-field':
      return 'text-field'

    case 'text-font':
      return 'text-font'

    case 'text-size':
      return 'text-size'

    case 'text-max-width':
      return 'text-max-width'

    case 'text-line-height':
      return 'text-line-height'

    case 'text-letter-spacing':
      return 'text-letter-spacing'

    case 'text-anchor':
      return 'text-anchor'

    case 'text-max-angle':
      return 'text-max-angle'

    case 'text-offset':
      return 'text-offset'

    case 'text-translate':
      return 'text-translate'

    case 'text-rotate':
      return 'text-rotate'

    case 'symbol-spacing':
      return 'symbol-spacing'

    case 'symbol-placement':
      return 'symbol-placement'



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
    //special
    case 'line-dasharray':
      return 'line-dasharray'
    case 'line-offset':
      return 'line-offset'
    default:
      return ''
  }

}
//type='fill'
function fillMap(key) {
  switch (key) {
    case 'fill-opacity':
      return '@fill-opacity';
    case 'fill-color':
      return '@fill';
    default:
      return '';

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
    case 'circle-color':
      return '@fill'
    case 'circle-opacity':
      return '@opacity'
//special
    case 'circle-radius':
      return 'circle-radius'

    case 'circle-translate':
      return 'circle-translate'
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
