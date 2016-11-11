/**
 * Created by lijing on 2016/7/15.
 */
var em=16;
var path=require('path');

function Update(obj,filedir){
    var counts=Object.getOwnPropertyNames(obj).length;
    var count=0;

    for(var p in obj){
        if(p.indexOf('Symbolizer')!==-1){
            if(p==='TextSymbolizer'){
                obj.TextSymbolizer["@avoid-edges"]=true;
                obj.TextSymbolizer["@allow-overlap"]=false;
                if(obj.TextSymbolizer['text-size']==undefined){
                    obj.TextSymbolizer['@size']=16;
                    delete obj.TextSymbolizer['text-size'];
                }
                else{
                    obj.TextSymbolizer['@size']=obj.TextSymbolizer['text-size'];
                    delete obj.TextSymbolizer['text-size'];
                }
                if(obj.TextSymbolizer['text-max-angle']==undefined){
                    obj.TextSymbolizer['@max-char-angle-delta']=45;
                    delete obj.TextSymbolizer['text-max-angle'];
                }
                else{
                    obj.TextSymbolizer['@max-char-angle-delta']=obj.TextSymbolizer['text-max-angle'];
                    delete obj.TextSymbolizer['text-max-angle'];
                }
                for(var proper in obj.TextSymbolizer){
                    switch (proper){
                        case 'symbol-spacing':
                            obj.TextSymbolizer['@spacing']=obj.TextSymbolizer[proper];
                            if(obj.MarkersSymbolizer){
                                obj.MarkersSymbolizer['@spacing']=obj.TextSymbolizer[proper];
                            }
                            delete obj.TextSymbolizer[proper];
                            break;
                        case 'symbol-placement':
                            obj.TextSymbolizer['@placement']=obj.TextSymbolizer[proper];
                            if(obj.MarkersSymbolizer){
                                obj.MarkersSymbolizer['@placement']=obj.TextSymbolizer[proper];
                            }
                            delete obj.TextSymbolizer[proper];
                            break;
                        case 'text-anchor':
                            if (obj.TextSymbolizer[proper] == 'left' || obj.TextSymbolizer[proper] == 'right') {
                                obj.TextSymbolizer['@horizontal-alignment'] = obj.TextSymbolizer[proper];
                            }
                            else if (obj.TextSymbolizer[proper] == 'bottom' || obj.TextSymbolizer[proper] == 'top') {
                                obj.TextSymbolizer['@vertical-alignment'] = obj.TextSymbolizer[proper];
                            }
                            else if (obj.TextSymbolizer[proper] == 'center') {
                                obj.TextSymbolizer['@horizontal-alignment'] = 'middle';
                                obj.TextSymbolizer['@vertical-alignment'] = 'middle';
                            }
                            else {
                                var arr = obj.TextSymbolizer[proper].split('-');
                                obj.TextSymbolizer['@horizontal-alignment'] = arr[1];
                                obj.TextSymbolizer['@vertical-alignment'] = arr[0];
                            }
                            delete obj.TextSymbolizer[proper];
                            break;
                        case 'text-field':
                            obj.TextSymbolizer['#cdata'] = obj.TextSymbolizer[proper].replace('\{', '\[').replace('\}', '\]');
                            if (obj.TextSymbolizer['#cdata'].indexOf('\[') == -1) {
                                obj.TextSymbolizer['#cdata'] = "'" + obj.TextSymbolizer['#cdata'] + "'";
                            }
                            delete obj.TextSymbolizer[proper];
                            break;

                        case 'text-font':
                            obj.TextSymbolizer['@face-name'] = obj.TextSymbolizer[proper].join();
                            delete obj.TextSymbolizer[proper];
                            break;

                        case 'text-max-width':
                            obj.TextSymbolizer['@wrap-width'] = obj.TextSymbolizer[proper] * em;
                            obj.TextSymbolizer['@wrap-before'] = true;
                            delete obj.TextSymbolizer[proper];
                            break;

                        case 'text-line-height':
                            obj.TextSymbolizer['@line-spacing'] = obj.TextSymbolizer[proper] * em;
                            delete obj.TextSymbolizer[proper];
                            break;

                        case 'text-letter-spacing':
                            obj.TextSymbolizer['@character-spacing'] = obj.TextSymbolizer[proper] * em;
                            delete obj.TextSymbolizer[proper];
                            break;

                        case 'text-offset':
                            if(obj.TextSymbolizer['@dx']){
                                obj.TextSymbolizer['@dx']+=obj.TextSymbolizer[proper][0]*em;
                            }
                            else{
                                obj.TextSymbolizer['@dx']=obj.TextSymbolizer[proper][0]*em;
                            }
                            if(obj.TextSymbolizer['@dy']){
                                obj.TextSymbolizer['@dy']+=obj.TextSymbolizer[proper][1]*em;
                            }
                            else{
                                obj.TextSymbolizer['@dy']=obj.TextSymbolizer[proper][1]*em;
                            }
                            delete obj.TextSymbolizer[proper];
                            break;

                        case 'text-translate':
                            if(obj.TextSymbolizer['@dx']){
                                obj.TextSymbolizer['@dx']+=obj.TextSymbolizer[proper][0];
                            }
                            else{
                                obj.TextSymbolizer['@dx']=obj.TextSymbolizer[proper][0];
                            }
                            if(obj.TextSymbolizer['@dy']){
                                obj.TextSymbolizer['@dy']+=obj.TextSymbolizer[proper][1];
                            }
                            else{
                                obj.TextSymbolizer['@dy']=obj.TextSymbolizer[proper][1];
                            }

                            delete obj.TextSymbolizer[proper];
                            break;
                        case 'text-rotate':
                            obj.TextSymbolizer['@orientation'] =-obj.TextSymbolizer[proper];
                            delete obj.TextSymbolizer[proper];
                            break;

                        default :
                            break;
                    }
                }

            }
            else if(p==='LineSymbolizer'){
                for(var proper in obj.LineSymbolizer){
                    switch(proper) {
                        case 'line-dasharray':
                            if(obj.LineSymbolizer['@stroke-width']){
                                var width=obj.LineSymbolizer['@stroke-width'];
                                obj.LineSymbolizer['@stroke-dasharray']=obj.LineSymbolizer[proper].map(function(x){return x*width;});
                            }
                            else{
                                obj.LineSymbolizer['@stroke-dasharray']=obj.LineSymbolizer[proper].join();
                            }
                            delete obj.LineSymbolizer[proper];
                            break;
                        case 'line-offset':
                            obj.LineSymbolizer['@offset']=-obj.LineSymbolizer[proper];
                            delete obj.LineSymbolizer[proper];
                            break;
                        default :
                            break;
                    }
                }
            }
            else if(p==='LinePatternSymbolizer'){
                if(obj.LinePatternSymbolizer['line-pattern']){
                    obj.LinePatternSymbolizer['@file']=path.join(filedir, obj.LinePatternSymbolizer['line-pattern']).replace(/\\/g,'\/')+'.png';
                    delete obj.LinePatternSymbolizer['line-pattern'];
                }
            }
            else if(p==='MarkersSymbolizer'){
                //if(obj.MarkersSymbolizer['symbol-spacing']==undefined){
                //    obj.MarkersSymbolizer['@spacing']=250;
                //    delete obj.MarkersSymbolizer['symbol-spacing'];
                //}
                //else{
                //    obj.MarkersSymbolizer['@spacing']=obj.MarkersSymbolizer['symbol-spacing'];
                //    delete obj.MarkersSymbolizer['symbol-spacing'];
                //}
                for(var proper in obj.MarkersSymbolizer){
                    switch (proper){
                        case 'icon-size':
                            if(obj.MarkersSymbolizer['icon-size']!==1){
                                if(obj.MarkersSymbolizer['@transform']){
                                    obj.MarkersSymbolizer['@transform']+=' scale' + '\(' + obj.MarkersSymbolizer[proper] + '\)';
                                }
                                else{
                                    obj.MarkersSymbolizer['@transform']=' scale' + '\(' + obj.MarkersSymbolizer[proper] + '\)';
                                }
                            }
                            delete obj.MarkersSymbolizer[proper];
                            break;

                        case 'icon-image':
                            obj.MarkersSymbolizer['@file'] = path.join(filedir,obj.MarkersSymbolizer[proper]).replace(/\\/g,'\/')+'.svg';
                            delete obj.MarkersSymbolizer[proper];
                            break;

                        case 'icon-rotate':
                            if(obj.MarkersSymbolizer['@transform']){
                                obj.MarkersSymbolizer['@transform']+=' rotate' + '\(' + obj.MarkersSymbolizer[proper] + '\)';
                            }
                            else{
                                obj.MarkersSymbolizer['@transform']=' rotate' + '\(' + obj.MarkersSymbolizer[proper] + '\)';
                            }
                            delete obj.MarkersSymbolizer[proper];
                            break;

                        case 'icon-offset':
                            if(obj.MarkersSymbolizer['@transform']){
                                obj.MarkersSymbolizer['@transform']+=' translate' + '\(' + obj.MarkersSymbolizer[proper].join() + '\)';
                            }
                            else{
                                obj.MarkersSymbolizer['@transform']=' translate' + '\(' + obj.MarkersSymbolizer[proper].join() + '\)';
                            }
                            delete obj.MarkersSymbolizer[proper];
                            break;

                        //case 'icon-translate':
                        //    return 'icon-translate?'

                        case 'circle-radius':
                            obj.MarkersSymbolizer['@width'] = obj.MarkersSymbolizer[proper];
                            obj.MarkersSymbolizer['@height'] = obj.MarkersSymbolizer[proper];
                            obj.MarkersSymbolizer['@marker-type'] = 'ellipse';
                            delete obj.MarkersSymbolizer[proper];
                            break;

                        case 'circle-translate':
                            if(obj.MarkersSymbolizer['@transform']){
                                obj.MarkersSymbolizer['@transform']+=' translate' + '\(' + obj.MarkersSymbolizer[proper].join() + '\)';
                            }
                            else{
                                obj.MarkersSymbolizer['@transform']=' translate' + '\(' + obj.MarkersSymbolizer[proper].join() + '\)';
                            }
                            delete obj.MarkersSymbolizer[proper];
                            break;


                        default:
                            break;
                    }
                }
            }
            else if(p==='PolygonPatternSymbolizer'){
                if(obj.PolygonPatternSymbolizer['@file']){
                    obj.PolygonPatternSymbolizer['@file']=path.join(filedir, obj.PolygonPatternSymbolizer['@file']).replace(/\\/g,'\/')+'.png';
                }
            }
            else if(p==='ShieldSymbolizer'){
                obj.ShieldSymbolizer["@avoid-edges"]=true;
                obj.ShieldSymbolizer["@allow-overlap"]=false;
                //default value
                if(obj.ShieldSymbolizer['symbol-spacing']==undefined){
                   obj.ShieldSymbolizer['@spacing']=250;
                   obj.ShieldSymbolizer['@minimum-distance']=250;
                   delete obj.ShieldSymbolizer['symbol-spacing'];
                }
                else{
                   obj.ShieldSymbolizer['@spacing']=obj.ShieldSymbolizer['symbol-spacing'];
                   obj.ShieldSymbolizer['@minimum-distance']=obj.ShieldSymbolizer['symbol-spacing'];
                   delete obj.ShieldSymbolizer['symbol-spacing'];
                }

                if(obj.ShieldSymbolizer['text-size']==undefined){
                    obj.ShieldSymbolizer['@size']=16;
                    delete obj.ShieldSymbolizer['text-size'];
                }
                else{
                    obj.ShieldSymbolizer['@size']=obj.ShieldSymbolizer['text-size'];
                    delete obj.ShieldSymbolizer['text-size'];
                }

                if(obj.ShieldSymbolizer['text-max-angle']==undefined){
                    obj.ShieldSymbolizer['@max-char-angle-delta']=45;
                    delete obj.ShieldSymbolizer['text-max-angle'];
                }
                else{
                    obj.ShieldSymbolizer['@max-char-angle-delta']=obj.ShieldSymbolizer['text-max-angle'];
                    delete obj.ShieldSymbolizer['text-max-angle'];
                }

                for(var proper in obj.ShieldSymbolizer){
                    switch (proper){
                        case 'symbol-placement':
                            obj.ShieldSymbolizer['@placement']=obj.ShieldSymbolizer[proper];
                            delete obj.ShieldSymbolizer[proper];
                            break;
                        case 'text-anchor':
                            if (obj.ShieldSymbolizer[proper] == 'left' || obj.ShieldSymbolizer[proper] == 'right') {
                                obj.ShieldSymbolizer['@horizontal-alignment'] = obj.ShieldSymbolizer[proper];
                            }
                            else if (obj.ShieldSymbolizer[proper] == 'bottom' || obj.ShieldSymbolizer[proper] == 'top') {
                                obj.ShieldSymbolizer['@vertical-alignment'] = obj.ShieldSymbolizer[proper];
                            }
                            else if (obj.ShieldSymbolizer[proper] == 'center') {
                                obj.ShieldSymbolizer['@horizontal-alignment'] = 'middle';
                                obj.ShieldSymbolizer['@vertical-alignment'] = 'middle';
                            }
                            else {
                                var arr = obj.ShieldSymbolizer[proper].split('-');
                                obj.ShieldSymbolizer['@horizontal-alignment'] = arr[1];
                                obj.ShieldSymbolizer['@vertical-alignment'] = arr[0];
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;
                        case 'text-field':
                           if(obj.Filter){
                               obj.Filter+=" and  \("+obj.ShieldSymbolizer[proper].replace('\{', '\[').replace('\}', '\]')+"!=null\)";
                           }
                            obj.ShieldSymbolizer['#cdata'] = obj.ShieldSymbolizer[proper].replace('\{', '\[').replace('\}', '\]');
                            if (obj.ShieldSymbolizer['#cdata'].indexOf('\[') == -1) {
                                obj.ShieldSymbolizer['#cdata'] = "'" + obj.ShieldSymbolizer['#cdata'] + "'";
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'text-font':
                            obj.ShieldSymbolizer['@face-name'] = obj.ShieldSymbolizer[proper].join();
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'text-max-width':
                            obj.ShieldSymbolizer['@wrap-width'] = obj.ShieldSymbolizer[proper] * em;
                            obj.ShieldSymbolizer['@wrap-before'] = true;
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'text-line-height':
                            obj.ShieldSymbolizer['@line-spacing'] = obj.ShieldSymbolizer[proper] * em;
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'text-letter-spacing':
                            obj.ShieldSymbolizer['@character-spacing'] = obj.ShieldSymbolizer[proper] * em;
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'text-offset':
                            if(obj.ShieldSymbolizer['@dx']){
                                obj.ShieldSymbolizer['@dx']+=obj.ShieldSymbolizer[proper][0]*em;
                            }
                            else{
                                obj.ShieldSymbolizer['@dx']=obj.ShieldSymbolizer[proper][0]*em;
                            }
                            if(obj.ShieldSymbolizer['@dy']){
                                obj.ShieldSymbolizer['@dy']+=obj.ShieldSymbolizer[proper][1]*em;
                            }
                            else{
                                obj.ShieldSymbolizer['@dy']=obj.ShieldSymbolizer[proper][1]*em;
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'text-translate':
                            if(obj.ShieldSymbolizer['@dx']){
                                obj.ShieldSymbolizer['@dx']+=obj.ShieldSymbolizer[proper][0];
                            }
                            else{
                                obj.ShieldSymbolizer['@dx']=obj.ShieldSymbolizer[proper][0];
                            }
                            if(obj.ShieldSymbolizer['@dy']){
                                obj.ShieldSymbolizer['@dy']+=obj.ShieldSymbolizer[proper][1];
                            }
                            else{
                                obj.ShieldSymbolizer['@dy']=obj.ShieldSymbolizer[proper][1];
                            }

                            delete obj.ShieldSymbolizer[proper];
                            break;
                        case 'text-rotate':
                            if(obj.ShieldSymbolizer['@transform']){
                                obj.ShieldSymbolizer['@transform']+=' rotate' + '\(' + obj.ShieldSymbolizer[proper] + '\)';
                            }
                            else{
                                obj.ShieldSymbolizer['@transform']=' rotate' + '\(' + obj.ShieldSymbolizer[proper] + '\)';
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;
                        case 'icon-size':
                            if(obj.ShieldSymbolizer['icon-size']!==1){
                                if(obj.ShieldSymbolizer['@transform']){
                                    obj.ShieldSymbolizer['@transform']+=' scale' + '\(' + obj.ShieldSymbolizer[proper] + '\)';
                                }
                                else{
                                    obj.ShieldSymbolizer['@transform']=' scale' + '\(' + obj.ShieldSymbolizer[proper] + '\)';
                                }
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'icon-image':
                            obj.ShieldSymbolizer['@file'] = path.join(filedir,obj.ShieldSymbolizer[proper]).replace(/\\/g,'\/')+'.svg';
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'icon-rotate':
                            if(obj.ShieldSymbolizer['@transform']){
                                obj.ShieldSymbolizer['@transform']+=' rotate' + '\(' + obj.ShieldSymbolizer[proper] + '\)';
                            }
                            else{
                                obj.ShieldSymbolizer['@transform']=' rotate' + '\(' + obj.ShieldSymbolizer[proper] + '\)';
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        case 'icon-offset':
                            if(obj.ShieldSymbolizer['@transform']){
                                obj.ShieldSymbolizer['@transform']+=' translate' + '\(' + obj.ShieldSymbolizer[proper].join() + '\)';
                            }
                            else{
                                obj.ShieldSymbolizer['@transform']=' translate' + '\(' + obj.ShieldSymbolizer[proper].join() + '\)';
                            }
                            delete obj.ShieldSymbolizer[proper];
                            break;
                        case '@ignore-placement':
                            delete obj.ShieldSymbolizer[proper];
                            break;

                        default :
                            break;
                    }
                }

            }
        }
        count++;
        if(count>=counts){
            return obj
        }
    }
}

exports.Update=Update;