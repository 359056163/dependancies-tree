const path = require('path');
module.exports = {
    basePath:(function () {
        let nm = 'node_modules';
        let index = __dirname.indexOf(nm);
        if(index>0){
            return __dirname.substring(0,index+nm.length);
        }
        return path.join(__dirname ,nm);
    })(),
    nativeModules:(function () {
        let names = [];
        let natives = process.binding('natives');
        for (let key in natives) {
            if (key.indexOf('_') !== 0 && !key.startsWith('internal') && !key.startsWith('v8')) {
                names.push(key);
            }
        }
        return new Set(names);
    })()
};