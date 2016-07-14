var path = require('path');
var mapping = require('./map');
var uti = require('./uti');
// suppose 1em=16px;
var em = 16;


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
function symbolizer(layer, filedir) {
    switch (layer.type) {
        //case 'background':
        //    return bgTranslate(layer);
        case 'line':
            return lineTranslate(layer, filedir);
        case 'fill':
            return fillTranslate(layer, filedir);
        case 'symbol':
            return symbolTranslate(layer, filedir);
        case 'raster':
            return rasterTranslate(layer);
        case 'circle':
            return circleTranslate(layer);
        default :
            return {};
    }
}


function bgTranslate(layer,filedir) {
    var bg = {};
    layer.forEach(function (e) {
        if (e.type == 'background') {
            for (var p in e.paint) {
                var key = mapping.bgMap(p);
                if (key !== '') {
                    if(key==='@background-image'){
                        bg[key]=path.join(filedir, e.paint[p]).replace(/\\/g,'\/');
                    }
                    else{
                    bg[key] = e.paint[p];
                    }
                }
            }
        }
    });
    if(bg['@background-opacity']&&bg['@background-color']){
        var v=parseInt(bg['@background-opacity']*255).toString(16);
        bg['@background-color']+=v;
        delete bg['@background-opacity'];
    }
    else if(bg['@background-opacity']&&bg['@background-color']==undefined){
        var v=parseInt(bg['@background-opacity']*255).toString(16);
        bg['@background-color']="000000"+v;
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
function lineTranslate(layer, filedir) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var gstyle = uti.extend(layer.paint, layer.layout);
        var line_symbol = {LineSymbolizer: {},LinePatternSymbolizer:{}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            //LineSymbolizer
            var key = mapping.lineMap(p);
            if (key !== '') {
                //if (key == '@stroke-dasharray') {
                //    line_symbol.LineSymbolizer[key] = gstyle[p].join();
                //}
                if (key == '@file') {
                    line_symbol.LinePatternSymbolizer[key] = path.join(filedir, gstyle[p]).replace(/\\/g,'\/')+ '.svg';
                }
                else if (key == '@offset') {
                    line_symbol.LineSymbolizer[key] = -gstyle[p];
                }
                else {
                    line_symbol.LineSymbolizer[key] = gstyle[p];
                }

            }
            if (line_symbol['@stroke-dasharray']) {
                if (line_symbol['@stroke-width']) {
                    var n = line_symbol['@stroke-width'];
                    var arr = line_symbol['@stroke-dasharray'].map(function (x) {
                        return x * n;
                    });
                    line_symbol['@stroke-dasharray'] = arr.join();
                }
                else {
                    line_symbol['@stroke-dasharray'] = line_symbol['@stroke-dasharray'].join();
                }

            }
            count++;
            if(count>=counts){
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
function fillTranslate(layer, filedir) {
    if (invisisble(layer)) {
        return {};
    }
    else {
        var gstyle = uti.extend(layer.paint, layer.layout);
        var fill_symbol = {PolygonSymbolizer: {}, LineSymbolizer: {},PolygonPatternSymbolizer:{}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            //MarkersSymbolizer
            var key = mapping.fillMap(p);
            if (key !== '') {
                if (key == '@file') {
                    fill_symbol.PolygonPatternSymbolizer[key] = path.join(filedir, gstyle[p]).replace(/\\/g,'\/')+ '.svg';
                }
                else {
                    fill_symbol.PolygonSymbolizer[key] = gstyle[p];
                }
            }

            if (gstyle['fill-outline-color']) {
                fill_symbol.LineSymbolizer = {
                    '@stroke': gstyle['fill-outline-color']
                }
            }
            count++;
            if(count>=counts){
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
function symbolTranslate(layer, filedir) {
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
                symbolizer.MarkersSymbolizer['@spacing']=250;
                if (p == 'icon-rotate') {
                    if (symbolizer.MarkersSymbolizer['@transform']) {
                        symbolizer.MarkersSymbolizer['@transform'] += ' rotate' + '\(' + gstyle[p] + '\)';
                    }
                    else {
                        symbolizer.MarkersSymbolizer['@transform'] = ' rotate' + '\(' + gstyle[p] + '\)';
                    }
                }

                else if (p == 'icon-offset') {
                    if (symbolizer.MarkersSymbolizer['@transform']) {
                        symbolizer.MarkersSymbolizer['@transform'] += ' translate' + '\(' + gstyle[p] + '\)';
                    }
                    else {
                        symbolizer.MarkersSymbolizer['@transform'] = ' translate' + '\(' + gstyle[p] + '\)';
                    }
                }
                else if (p == 'icon-size') {
                    if (gstyle[p] !== 1) {
                        if (gstyle[p].stops) {
                            var l = gstyle[p].stops.length;
                            var i = 0;
                            while (i < length) {
                                gstyle[p].stops[i][1] = ' scale' + '\(' + gstyle[p] + '\)';
                                i++;
                                if (i >= length) {
                                    symbolizer.TextSymbolizer[key] = gstyle[p];
                                }
                            }
                        }
                        else {
                            if (symbolizer.MarkersSymbolizer['@transform']) {
                                symbolizer.MarkersSymbolizer['@transform'] += ' scale' + '\(' + gstyle[p] + '\)';
                            }
                            else {
                                symbolizer.MarkersSymbolizer['@transform'] = ' scale' + '\(' + gstyle[p] + '\)';
                            }
                        }
                    }
                }
                else if (p == 'icon-image') {
                    symbolizer.MarkersSymbolizer['@file'] = path.join(filedir, gstyle[p]).replace(/\\/g,'\/')+'.svg';
                }
                else {
                    var key = mapping.symbolMap(p);
                    if (key !== '') {
                        symbolizer.MarkersSymbolizer[key] = gstyle[p];
                    }
                }
            }

            //TextSymbolizer
            else {
                if(symbolizer.TextSymbolizer['@max-char-angle-delta']===undefined){
                    symbolizer.TextSymbolizer['@max-char-angle-delta']=45;
                }
                if (p == 'text-offset') {
                    symbolizer.TextSymbolizer['@dx'] = gstyle[p][0];
                    symbolizer.TextSymbolizer['@dy'] = gstyle[p][1];
                }

                else if (p == 'text-anchor') {
                    if (gstyle[p] == 'left' || gstyle[p] == 'right') {
                        symbolizer.TextSymbolizer['@horizontal-alignment'] = gstyle[p];
                    }
                    else if (gstyle[p] == 'bottom' || gstyle[p] == 'top') {
                        symbolizer.TextSymbolizer['@vertical-alignment'] = gstyle[p];
                    }
                    else if (gstyle[p] == 'center') {
                        symbolizer.TextSymbolizer['@horizontal-alignment'] = 'middle';
                        symbolizer.TextSymbolizer['@vertical-alignment'] = 'middle';
                    }
                    else {
                        var arr = gstyle[p].split('-');
                        symbolizer.TextSymbolizer['@horizontal-alignment'] = arr[1];
                        symbolizer.TextSymbolizer['@vertical-alignment'] = arr[0];
                    }
                }

                else if (p == 'text-offset') {
                    symbolizer.TextSymbolizer['@dx'] = gstyle[p][0];
                    symbolizer.TextSymbolizer['@dy'] = gstyle[p][1];
                }

                else {
                    var key = mapping.textMap(p);
                    if (key !== '') {
                        if (key == '@wrap-width' || key == '@line-spacing' || key == '@character-spacing') {
                            if (gstyle[p].stops) {
                                var l = gstyle[p].stops.length;
                                var i = 0;
                                while (i < length) {
                                    gstyle[p].stops[i][1] *= em;
                                    i++;
                                    if (i >= length) {
                                        symbolizer.TextSymbolizer[key] = gstyle[p]
                                    }
                                }
                            }

                            else {
                                symbolizer.TextSymbolizer[key] = gstyle[p] * em;
                            }
                        }

                        else if (key == '#cdata') {
                            var length = gstyle[p];
                            symbolizer.TextSymbolizer[key] = gstyle[p].replace('\{', '\[').replace('\}', '\]');
                            if (symbolizer.TextSymbolizer[key].indexOf('\[') == -1) {
                                symbolizer.TextSymbolizer[key] = "'" + symbolizer.TextSymbolizer[key] + "'";
                            }
                        }
                        else if (key == '@face-name') {
                            symbolizer.TextSymbolizer[key] = gstyle[p].join();
                        }

                        else if (key == '@displacement') {
                            symbolizer.TextSymbolizer[key] = gstyle[p].replace('\[', '\(').replace('\]', '\)');
                        }
                        else {
                            symbolizer.TextSymbolizer[key] = gstyle[p];
                        }
                    }

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
        var symbolizer = {MarkerSymbolizer: {}};
        var count = 0;
        var counts = Object.getOwnPropertyNames(gstyle).length;
        for (var p in gstyle) {
            if (p == 'circle-radius') {
                symbolizer.MarkerSymbolizer['@width'] = gstyle[p];
                symbolizer.MarkerSymbolizer['@height'] = gstyle[p];
                symbolizer.MarkerSymbolizer['@marker-type'] = 'ellipse';
            }
            else if (p == 'circle-translate') {
                symbolizer.MarkerSymbolizer['@transform'] = 'translate' + gstyle[p].replace('\[', '\(').replace('\]', '\)');
            }
            else {
                var key = mapping.circleMap(p);
                if (key !== '') {
                    symbolizer.MarkerSymbolizer[key] = gstyle[p];
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
