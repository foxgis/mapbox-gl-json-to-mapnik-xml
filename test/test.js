var fs=require('fs');
var mgl2xml=require('../index');

fs.readFile('test/files/admin-v8-2.json', 'utf-8', function (err, data) {
    if (err) console.log(err);
    else {
        var obj = JSON.parse(data.toString());

        mgl2xml.gl2xml(obj, function (err, result) {
            console.log(result.toString());
        });
    }
});
