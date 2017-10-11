let moduleName = process.argv[2] || 'eventproxy';
console.log(moduleName);
console.log(
    require('util').inspect(
        require("./index.js").start(moduleName),
        {depth:null}
    )
);
