"use strict";

const executor = require("./executor");

function isInstalled(name) {
    try {
        require(name);
        return true;
    }catch (e){
        return false;
    }
}
module.exports = {
    start:(name)=>{
        if(isInstalled(name)){
            return executor.execute(name);
        }else{
            throw new Error(`please install module:${name} first. `)
        }
    }
}

