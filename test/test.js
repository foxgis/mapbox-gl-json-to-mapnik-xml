var fs=require('fs');
var mgl2xml=require('../index');

fs.readFile('./files/foxgis-admin.json', 'utf-8', function (err, data) {
    if (err) console.log(err);
    else {
        var obj = JSON.parse(data.toString());
        mgl2xml(obj, function (err, result) {
            fs.writeFile('files/result.xml',result,function(err,data){
                if(err){console.log(err);}
                else{console.log('ok');}
            })
        });
    }
});
