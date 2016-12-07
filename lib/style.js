/**
 * Created by xinxi on 2016/7/28.
 */
var trans = require('./Translate')
var filter = require('./filter')
var fn = require('./fn')
var uti = require('./uti')
var special = require('./special');
// the relation between zoom and scaleDenominator
var ranges = {
    0: 2000000000,
    1: 1000000000,
    2: 500000000,
    3: 200000000,
    4: 100000000,
    5: 50000000,
    6: 25000000,
    7: 12500000,
    8: 6500000,
    9: 3000000,
    10: 1500000,
    11: 750000,
    12: 400000,
    13: 200000,
    14: 100000,
    15: 50000,
    16: 25000,
    17: 12500,
    18: 5000,
    19: 2500,
    20: 1500,
    21: 750,
    22: 500,
    23: 250,
    24: 100
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
    var symbols_arr = []
    var symbols = trans.symbolizer(layer)
    if (uti.isEmptyObject(symbols)) {
        callback(null, [])
    }
    filter.Filter(layer.filter, function (err, filt) {
        if (err) {
            callback(err);
        }
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
                    var szoom = zoomScale(e[s])
                    var smin = szoom[0];
                    var smax = szoom[1];

                    if (smin > layer_maxzoom || smax < layer_minzoom) {
                        var rule = {};
                        if (smin > layer_maxzoom) {
                            rule = styleCopy(e[s], s, layer_maxzoom)
                        }
                        else if (smax < layer_minzoom) {
                            rule = styleCopy(e[s], s, layer_minzoom)
                        }
                        rule.Filter = filt;
                        rule.MinScaleDenominator = ranges[layer_maxzoom + 1]
                        rule.MaxScaleDenominator = ranges[layer_minzoom];
                        rules.push(rule);
                    }
                    else if (smin <= layer_minzoom) {
                        var z = layer_minzoom;
                        var end = smax < layer_maxzoom ? smax : layer_maxzoom;
                        while (z <= end) {
                            var rule = {};
                            rule = styleCopy(e[s], s, z);
                            rule.Filter = filt;
                            rule.MaxScaleDenominator = ranges[z];
                            rule.MinScaleDenominator = ranges[z + 1]
                            rules.push(rule);
                            z++;
                        }
                        if (smax < layer_maxzoom) {
                            var rule2 = {};
                            rule2 = styleCopy(e[s], s, smax + 1)
                            rule2.Filter = filt;
                            rule2.MaxScaleDenominator = ranges[smax + 1];
                            rule2.MinScaleDenominator = ranges[layer_maxzoom+1];
                            rules.push(rule2);
                        }
                    }
                    else if (smin > layer_minzoom) {
                        var rule = {};
                        rule = styleCopy(e[s], s, smin);
                        rule.Filter = filt;
                        rule.MaxScaleDenominator = ranges[layer_minzoom]
                        rule.MinScaleDenominator = ranges[smin]
                        rules.push(rule);
                        var z = smin;
                        var end = smax < layer_maxzoom ? smax : layer_maxzoom;
                        while (z <= end) {
                            var rule1 = {};
                            rule1 = styleCopy(e[s], s, z);
                            rule1.Filter = filt;
                            rule1.MaxScaleDenominator = ranges[z];
                            rule1.MinScaleDenominator = ranges[z + 1]
                            rules.push(rule1);
                            z++;
                        }
                        if (smax < layer_maxzoom) {
                            var rule2 = {};
                            rule2 = styleCopy(e[s], s, smax + 1)
                            rule2.Filter = filt;
                            rule2.MaxScaleDenominator = ranges[smax + 1];
                            rule2.MinScaleDenominator = ranges[layer_maxzoom + 1];
                            rules.push(rule2);
                        }
                    }
                }
                else {
                    var rule = {}
                    rule.Filter = filt
                    rule[s] = copy(e[s])
                    if (layer_minzoom !== 0) {
                        rule.MaxScaleDenominator = ranges[layer_minzoom];
                    }
                    rule.MinScaleDenominator = ranges[layer_maxzoom + 1];
                    rules.push(rule)
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
                    // results.push(rest);
                    //注记优化标注开
                    if(rest.TextSymbolizer&&layer.autolabel){
                        var addFilter=[' and ([ldir]&gt;0 and [ldir]&lt;=45)',' and ([ldir]&gt;45 and [ldir]&lt;=90)',
                            ' and ([ldir]&gt;90 and [ldir]&lt;=135)',' and ([ldir]&gt;135 and [ldir]&lt;=180)',
                            ' and ([ldir]&gt;180 and [ldir]&lt;=225)',' and ([ldir]&gt;225 and [ldir]&lt;=270)',
                            ' and ([ldir]&gt;270 and [ldir]&lt;=315)',' and ([ldir]&gt;315 and [ldir]&lt;=360)',
                            ' and ([dir]=0 and [ldir]=null)',' and ([dir]=1 and [ldir]=null)'
                        ];
                        var dir=["NE,E,N,SE,S","E,NE,N,SE","E,SE,NE,N","S,SE,E,SW",
                                 "SW,W,S,NW,N","W,SW,S,NW","W,NW,SW,S","N,NW,W,NE",
                                 "NE,E,SE,W,N,SE,SW,S","E,N,S,W,NE,SE,NW,SW"
                        ];
                        //道路避让
                        for(var i=0;i<8;i++){
                            var temp={};
                            temp=uti.deepCopy(rest);
                            temp.Filter=temp.Filter?temp.Filter+addFilter[i]:addFilter[i];
                            temp.TextSymbolizer['@placements']=dir[i];
                            results.push(temp);
                        }
                        //ldir不存在，随机标注
                        var temp={};
                        temp=uti.deepCopy(rest);
                        temp.Filter=temp.Filter?temp.Filter+addFilter[8]:addFilter[8];
                        temp.TextSymbolizer['@placements']=dir[8];
                        results.push(temp);

                        var temp2=uti.deepCopy(rest);
                        temp2.Filter=temp2.Filter?temp2.Filter+addFilter[9]:addFilter[9];
                        temp2.TextSymbolizer['@placements']=dir[9];
                        results.push(temp2);
                    }
                    else{
                    results.push(rest);
                    }
                    c++;
                    if (c >= rules.length) {
                        callback(null, results);
                    }
                });
            }
        })
    })
}

function styleCopy(style, key, z) {
    var count = 0;
    var counts = Object.keys(style).length;
    var rule = {};
    rule[key] = copy(style);
    for (var l in style) {
        if (typeof style[l] == 'object' && style[l]['stops'] !== undefined) {
            rule[key][l] = fn.fun2zoom(style[l], z);
        }
        else {
            rule[key][l] = style[l]
        }
        count++;
    }
    if (count >= counts) {
        return rule;
    }
}

function zoomScale(symbol) {
    var smin = 22;
    var smax = 0;
    var count = 0;
    var counts = Object.getOwnPropertyNames(symbol).length
    for (var p in symbol) {
        if (typeof symbol[p] == 'object' && symbol[p]['stops'] !== undefined) {
            var length = symbol[p].stops.length;
            if (smin > symbol[p].stops[0][0]) {
                smin = symbol[p].stops[0][0]
            }
            if (smax < symbol[p].stops[length - 1][0]) {
                smax = symbol[p].stops[length - 1][0]
            }
        }
        count++;
    }
    if (count >= counts) {
        return [smin, smax];
    }

}


function contain_stops(symbol) {
    var tag = false
    var count = 0
    var length = Object.getOwnPropertyNames(symbol).length
    for (var p in symbol) {
        if (typeof symbol[p] == 'object' && symbol[p]['stops'] !== undefined) {
            tag = true
        }
        count++
    }
    if (count >= length) {
        return tag
    }
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
