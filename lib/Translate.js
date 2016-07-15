var path = require('path');
var mapping = require('./map');
var uti = require('./uti');
// suppose 1em=16px;



/*
 * Purpose:Check whether the layer is invisible
 * DATE:2016-6-14
 * Parameters:
 **@layer Object;The mapbox-gl Layer object
 * Return:
 ** Boolen;If the layer is invisible,return true;
 */
function invisisble(layer) {
    if (layer.layout) {
        if (layer.layout.visibility) {
            if (layer.layout.visibility == 'none') {
                return true;
            }
        }
    }
}

/*
 * Purpose:Translate the mapbox-gl Layer object to Mapnik XML Symbolizers object
 * DATE:2016-6-14
 * Parameters:
 **@layer:object; the mapbox-gl Layer object;
 * Return:
 ** the Mapnik XML Symbolizers object
 */
function symbolizer(layer) {
    switch (layer.type) {
        //case 'background':
        //    return bgTranslate(layer);
        case 'line':
            return lineTranslate(layer);
        case 'fill':
            return fillTranslate(layer);
        case 'symbol':
            return symbolTranslate(layer);
        case 'raster':
            return rasterTranslate(layer);
        case 'circle':
            return circleTranslate(layer);
        default :
            return {};
    }
}

function bgTranslate(layer, filedir) {
    var bg = {};
    layer.forEach(function (e) {
        if (e.type == 'background') {
            for (var p in e.paint) {
                var key = mapping.bgMap(p);
                if (key !== '') {
                    if (key === '@background-image') {
                        bg[key] = path.join(filedir, e.paint[p]).replace(/\\/g, '\/');
                    }
                    else {
                        bg[key] = e.paint[p];
                    }
                }
            }
        }
    });
    if (bg['@background-opacity'] && bg['@background-color']) {
        var v = parseInt(bg['@background-opacity'] * 255).toString(16);
        bg['@background-color'] += v;
        delete bg['@background-opacity'];
    }
    else if (bg['@background-opacity'] && bg['@background-color'] == undefined) {
        var v = parseInt(bg['@background-opacity'] * 255).toString(16);
        bg['@background-color'] = "000000" + v;
        delete bg['@background-opacity'];
    }
    return bg;
}


/*
 * Purpose:When Layer.type='line',generate Mapnik XML LineSymbolizers object
 * DATE:2016-6-14
 * Parameters:
 **@layer:object; the mapbox-gl Layer object;
 * Return:
 ** the Mapnik XML LineSymbolizers object
 */
function lineTranslate(layer) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var gstyle = uti.extend(layer.paint, layer.layout);
        var line_symbol = {LineSymbolizer: {}, LinePatternSymbolizer: {}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            //LineSymbolizer
            if (p == 'line-pattern') {
                line_symbol.LinePatternSymbolizer[p] = gstyle[p];
            }
            else{
                var key = mapping.lineMap(p);
                if (key !== '') {
                    line_symbol.LineSymbolizer[key] = gstyle[p];
                }
            }
            count++;
            if (count >= counts) {
                for (var proper in line_symbol) {
                    if (uti.isEmptyObject(line_symbol[proper])) {
                        delete line_symbol[proper];
                    }
                }
                return line_symbol;
            }
        }
    }
}


/*
 * Purpose:When Layer.type='fill',generate Mapnik XML FillSymbolizers object
 * DATE:2016-6-14
 * Parameters:
 **@layer:object; the mapbox-gl Layer object;
 * Return:
 ** the Mapnik XML FillSymbolizers object
 */
function fillTranslate(layer) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var gstyle = uti.extend(layer.paint, layer.layout);
        var fill_symbol = {PolygonSymbolizer: {}, LineSymbolizer: {}, PolygonPatternSymbolizer: {}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            //PolygonSymbolizer
            if (p == 'fill-outline-color' && gstyle['fill-outline-color']) {
                fill_symbol.LineSymbolizer = {
                    '@stroke': gstyle[p]
                }
            }
            else if (p == 'fill-pattern' && gstyle['fill-pattern']) {
                fill_symbol.PolygonPatternSymbolizer = {
                    '@file': gstyle[p]
                }
            }
            else {
                var key = mapping.fillMap(p);
                if (key !== '') {
                    fill_symbol.PolygonSymbolizer[key] = gstyle[p];
                }
            }
            count++;
            if (count >= counts) {
                for (var proper in fill_symbol) {
                    if (uti.isEmptyObject(fill_symbol[proper])) {
                        delete fill_symbol[proper];
                    }
                }
                return fill_symbol;
            }
        }
    }
}

/*
 * Purpose:When Layer.type='symbol',generate Mapnik XML MarkersSymbolizer and TextSymbolizer object
 * DATE:2016-6-14
 * Parameters:
 **@layer:object; the mapbox-gl Layer object;
 * Return:
 ** the Mapnik XML MarkersSymbolizer and TextSymbolizer object
 */
function symbolTranslate(layer) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var gstyle = uti.extend(layer.paint, layer.layout);
        var symbolizer = {TextSymbolizer: {}, MarkersSymbolizer: {}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            //MarkersSymbolizer
            if (p.indexOf('text') === -1) {
                var key = mapping.symbolMap(p);
                if (key !== '') {
                    symbolizer.MarkersSymbolizer[key] = gstyle[p];
                }
            }

            //TextSymbolizer
            else {
                var key = mapping.textMap(p);
                if (key !== '') {
                    symbolizer.TextSymbolizer[key] = gstyle[p];
                }
            }
            count++;
            if (count >= counts) {
                for (var proper in symbolizer) {
                    if (uti.isEmptyObject(symbolizer[proper])) {
                        delete symbolizer[proper];
                    }
                }
                return symbolizer;
            }
        }

    }
}
//type='raster'
function rasterTranslate(layer) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var count = 0;
        var gstyle = uti.extend(layer.paint, layer.layout);
        var symbolizer = {RasterSymbolizer: {}};
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            var key = mapping.rasterMap(p);
            if (key !== '') {
                symbolizer.RasterSymbolizer[key] = gstyle[p];
            }
            count++;
            if (count >= counts) {
                return symbolizer;
            }
        }
    }

}

//type='circle'
function circleTranslate(layer) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var gstyle = uti.extend(layer.paint, layer.layout);
        var symbolizer = {MarkersSymbolizer: {}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            if (p == 'circle-radius') {
                symbolizer.MarkersSymbolizer['@width'] = gstyle[p];
                symbolizer.MarkersSymbolizer['@height'] = gstyle[p];
                symbolizer.MarkersSymbolizer['@marker-type'] = 'ellipse';
            }
            else if (p == 'circle-translate') {
                symbolizer.MarkersSymbolizer['@transform'] = 'translate' + '\(' + gstyle[p].join() + '\)';
            }
            else {
                var key = mapping.circleMap(p);
                if (key !== '') {
                    symbolizer.MarkersSymbolizer[key] = gstyle[p];
                }
            }
            count++;
            if (count >= counts) {
                return symbolizer;
            }
        }
    }

}

exports.symbolizer = symbolizer;
exports.bgTranslate = bgTranslate;
