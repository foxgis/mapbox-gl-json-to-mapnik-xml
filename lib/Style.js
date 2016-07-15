var trans = require('./Translate')
var filter = require('./filter')
var fn = require('./fn')
var uti = require('./uti')
var special = require('./special');
// the relation between zoom and scaleDenominator
var ranges = {
    0: 1000000000,
    1: 500000000,
    2: 200000000,
    3: 100000000,
    4: 50000000,
    5: 25000000,
    6: 12500000,
    7: 6500000,
    8: 3000000,
    9: 1500000,
    10: 750000,
    11: 400000,
    12: 200000,
    13: 100000,
    14: 50000,
    15: 25000,
    16: 12500,
    17: 5000,
    18: 2500,
    19: 1500,
    20: 750,
    21: 500,
    22: 250,
    23: 100
}

/*
 Generate a mapnik XML Object----Map.Style  from a gl_json_object.layer
 @Parameter:
 **{object}  layer  gl_json_object.layer
 **{string}  markerUri  path to svg files

 @@Return:
 **{object} Style Object
 */

function getStyle(layer, markerUri, callback) {
    var layer_minzoom = layer.minzoom ? layer.minzoom : 0;
    var layer_maxzoom = layer.maxzoom ? layer.maxzoom : 22;

    var rules = []
    // var rule = {}
    var symbols_arr = []
    var filt = ''
    var symbols = trans.symbolizer(layer)
    if (uti.isEmptyObject(symbols)) {
        callback(null, [])
    }

    filter.Filter(layer.filter, function (err, result) {
        filt = result
    })
    for (var p in symbols) {
        var obj = {}
        obj[p] = symbols[p]
        symbols_arr.push(obj)
    }
    var n = 0
    symbols_arr.forEach(function (e) {

        for (var s in e) {
            var tag = contain_stops(e[s])
            if (tag === true) {
                var symbol1 = expendFun(e[s])
                var zoom_array = zoomExtent(symbol1)
                var symbol_array = zoomClip(symbol1, zoom_array)
                var minz = symbol_array.minzoom
                var maxz = symbol_array.maxzoom

                if (minz > layer_maxzoom || maxz < layer_minzoom) {
                    var rule3 = {}
                    rule3.Filter = filt
                    rule3[s] = copy(e[s])
                    var count3 = 0
                    var length = Object.getOwnPropertyNames(e[s]).length
                    for (var l in e[s]) {
                        if (e[s][l] instanceof Array) {
                            if (typeof e[s][l][0] == 'object' && !(e[s][l][0] instanceof Array)) {
                                delete rule3[s][l]
                            }
                        }
                        count3++
                        if (count3 >= length) {
                            rule3.MinScaleDenominator = ranges[layer_maxzoom + 1]
                            rule3.MaxScaleDenominator = ranges[layer_minzoom]
                            rules.push(rule3)
                        }
                    }
                    callback(null, rules);
                }

                else {

                    //when zoom<minz
                    if (minz > layer_minzoom) {
                        var rule2 = {}
                        rule2.Filter = filt
                        rule2[s] = copy(e[s])
                        var count = 0
                        var length = Object.getOwnPropertyNames(e[s]).length
                        for (var l in e[s]) {
                            if (e[s][l] instanceof Array) {
                                if (typeof e[s][l][0] == 'object' && !(e[s][l][0] instanceof Array)) {
                                    delete rule2[s][l]
                                }
                            }
                            count++
                            if (count >= length) {
                                rule2.MinScaleDenominator = ranges[minz]
                                rule2.MaxScaleDenominator = ranges[layer_minzoom]
                                rules.push(rule2)
                            }
                        }
                    }
                    // when  minz<zoom<maxz
                    if (minz <= layer_minzoom) {
                        var z = layer_minzoom
                    }
                    else {
                        var z = minz
                    }
                    if (maxz < layer_maxzoom) {
                        var end_zoom = maxz
                    }
                    else {
                        var end_zoom = layer_maxzoom
                    }
                    while (z <= end_zoom) {
                        var rule = {}
                        rule.Filter = filt
                        //rule[s] = copy(e[s])
                        rule.MinScaleDenominator = ranges[z + 1]
                        rule.MaxScaleDenominator = ranges[z]
                        rule[s] = symbol_array[z];
                        rules.push(rule)
                        z++
                    }
                    //when zoom>maxz
                    if (maxz < layer_maxzoom) {
                        var rule1 = {}
                        rule1.Filter = filt
                        rule1[s] = copy(e[s])
                        var count1 = 0
                        var length = Object.getOwnPropertyNames(e[s]).length
                        for (var l in e[s]) {
                            if (e[s][l] instanceof Array) {
                                if (typeof e[s][l][0] == 'object') {
                                    rule1[s][l] = e[s][l][0][maxz]
                                } else {
                                    rule[s][l] = e[s][l]
                                }
                            } else {
                                rule[s][l] = e[s][l]
                            }
                            count1++
                            if (count1 >= length) {
                                rule1.MaxScaleDenominator = ranges[maxz + 1]
                                rule1.MinScaleDenominator = ranges[layer_maxzoom + 1]
                                rules.push(rule1)
                            }
                        }
                    }
                }
            }
            else {
                var rule4 = {}
                rule4.Filter = filt
                rule4[s] = copy(e[s])
                if (layer_minzoom !== 0) {
                    rule4.MaxScaleDenominator = ranges[layer_minzoom];
                }
                rule4.MinScaleDenominator = ranges[layer_maxzoom + 1];
                rules.push(rule4)
            }
        }
        n++
        if (n >= symbols_arr.length) {
            var c = 0;
            var results = [];
            rules.forEach(function (e) {
                if (e.Filter === "") {
                    delete e['Filter'];
                }
                var rest = special.Update(e, markerUri);
                results.push(rest);
                c++;
                if (c >= rules.length) {
                    callback(null, results);
                }
            });
        }

    })
}

/*
 Purpose:check wether the attributes of a gl layer object contain STOPS
 @Parameter:
 **{object}  symbol the gl layer object
 @@Return:
 ** if contain stops,return TRUE
 ** if don't contain stops,return FALSE
 */

function contain_stops(symbol) {
    var tag = false
    var count = 0
    var length = Object.getOwnPropertyNames(symbol).length
    for (var p in symbol) {
        if (typeof symbol[p] == 'object' && symbol[p]['stops'] !== undefined) {
            tag = true
        }
        count++
        if (count >= length) {
            return tag
        }
    }
}


/*
 Purpose:Covert stops to  zoom-value

 Parameter:
 * * @symbol{object}---a Symbolizor object
 */
function expendFun(symbol) {
    var count = 0
    var counts = Object.getOwnPropertyNames(symbol).length
    if (contain_object(symbol)) {
        for (var p in symbol) {
            if (typeof symbol[p] == 'object' && !(symbol[p] instanceof Array)) {
                symbol[p] = fn.fun2zoom(symbol[p])
            }
            count++
            if (count >= counts) {
                return symbol
            }
        }
    }
}

/*
 Purpose:Get the minzoom,the minimum maxzoom and the maximum maxzoom among many stops
 */
function zoomExtent(symbol) {
    var zoom1 = 22
    var zoom2 = 0
    var minzoom = 22
    var count = 0
    var length = Object.getOwnPropertyNames(symbol).length
    for (var p in symbol) {
        if (count < length) {
            if (typeof symbol == 'object' && typeof symbol[p][0] == 'object') {
                if (minzoom > symbol[p][1]) {
                    minzoom = symbol[p][1]
                }
                if (zoom1 > symbol[p][2]) {
                    zoom1 = symbol[p][2]
                }
                if (zoom2 < symbol[p][2]) {
                    zoom2 = symbol[p][2]
                }
            }
            count++
            if (count >= length) {
                return [zoom1, zoom2, minzoom]
            }
        }
    }
}
/*
 @@symbol:{Array} the result of zoomExtent
 @@array:{Array}the result of expendFun
 */
function zoomClip(symbol, array) {
    var minzoom = array[2]
    var zoom1 = array[0]
    var zoom2 = array[1]
    var sym_arr = {}
    var zoom = minzoom
    while (zoom <= zoom2) {
        var sym_obj = {}
        if (zoom <= zoom1) {
            for (var p in symbol) {
                if (typeof symbol == 'object' && typeof symbol[p][0] == 'object' && symbol[p][0][zoom] !== 'undefined') {
                    if (symbol[p][0][zoom] !== undefined) {
                        sym_obj[p] = symbol[p][0][zoom]
                    }
                } else {
                    sym_obj[p] = symbol[p]
                }
            }
        } else if (zoom > zoom1 && zoom < zoom2) {
            for (var p in symbol) {
                if (typeof symbol == 'object' && typeof symbol[p][0] == 'object' && symbol[p][0][zoom] !== 'undefined') {
                    if (zoom > symbol[p][2]) {
                        sym_obj[p] = symbol[p][0][symbol[p][2]]
                    } else {
                        sym_obj[p] = symbol[p][0][zoom]
                    }
                } else {
                    sym_obj[p] = symbol[p]
                }
            }
        } else if (zoom > zoom2) {
            for (var p in symbol) {
                if (typeof symbol == 'object' && typeof symbol[p][0] == 'object' && symbol[p][0][zoom] !== 'undefined') {
                    sym_obj[p] = symbol[p][0][symbol[p][2]]
                } else {
                    sym_obj[p] = symbol[p]
                }
            }
        }
        sym_arr[zoom] = sym_obj
        zoom++
    }
    sym_arr['minzoom'] = minzoom
    sym_arr['maxzoom'] = zoom2
    return sym_arr
}

function contain_object(obj) {
    var result = false
    for (var p in obj) {
        if (typeof obj[p] == 'object' && !(obj[p] instanceof Array)) {
            result = true
        }
    }
    return result
}

function contain_array(obj) {
    var result = false
    for (var p in obj) {
        if (obj[p] instanceof Array) {
            result = true
        }
    }
    return result
}

function copy(s) {
    var result = {}
    for (var p in s) {
        result[p] = s[p]
    }
    return result
}

exports.getStyle = getStyle
